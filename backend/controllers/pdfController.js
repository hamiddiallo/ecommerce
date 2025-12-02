const puppeteer = require('puppeteer');
const supabase = require('../config/supabase');

/**
 * Generate PDF invoice for an order
 */
async function generateInvoicePDF(req, res) {
    const { id } = req.params;
    const userId = req.user.id; // From verifyToken middleware

    try {
        // Fetch order with items
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*, order_items(*, products(name, image_url))')
            .eq('id', id)
            .single();

        if (orderError || !order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if user owns this order or is admin
        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', userId)
            .single();

        const isAdmin = !!adminUser;

        if (!isAdmin && order.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Calculate invoice number
        const orderYear = new Date(order.created_at).getFullYear();
        const startOfYear = new Date(orderYear, 0, 1).toISOString();

        const { count } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfYear)
            .lte('created_at', order.created_at);

        const sequentialNumber = count || 0;
        const invoiceNumber = `MDHD-${orderYear}-${String(sequentialNumber).padStart(3, '0')}`;

        // Format data
        const formattedDate = new Date(order.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        // Generate HTML
        const html = generateInvoiceHTML(order, invoiceNumber, formattedDate);

        // Launch Puppeteer and generate PDF
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0.5cm',
                right: '0.5cm',
                bottom: '0.5cm',
                left: '0.5cm'
            }
        });

        await browser.close();

        // Send PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Facture-${invoiceNumber}.pdf"`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
}

/**
 * Generate HTML for invoice
 */
function generateInvoiceHTML(order, invoiceNumber, formattedDate) {
    const totalInWords = numberToWords(Math.floor(order.total));

    const itemsHTML = order.order_items.map((item, index) => `
        <tr>
            <td style="border: 1px solid #9ca3af; padding: 4px 6px; text-align: center; font-size: 13px;">${index + 1}</td>
            <td style="border: 1px solid #9ca3af; padding: 4px 10px; font-size: 13px;">${item.product_name}</td>
            <td style="border: 1px solid #9ca3af; padding: 4px 6px; text-align: center; font-size: 13px;">${item.quantity}</td>
            <td style="border: 1px solid #9ca3af; padding: 4px 6px; text-align: right; white-space: nowrap; font-size: 13px;">
                ${new Intl.NumberFormat('fr-GN').format(item.unit_price)} GNF
            </td>
            <td style="border: 1px solid #9ca3af; padding: 4px 6px; text-align: right; white-space: nowrap; font-size: 13px;">
                ${new Intl.NumberFormat('fr-GN').format(item.total_price)} GNF
            </td>
        </tr>
    `).join('');

    // Use absolute URL for logo - change this to your actual domain in production
    const logoUrl = process.env.FRONTEND_URL
        ? `${process.env.FRONTEND_URL}/uploads/logoFacture2.jpg`
        : 'http://localhost:3000/uploads/logoFacture2.jpg';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            padding: 0.5cm;
        }
        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
        }
        .header-left {
            width: 50%;
        }
        .header-right {
            width: 50%;
            text-align: right;
        }
        .logo {
            max-width: 220px;
            height: auto;
            margin-bottom: 10px;
        }
        .contact {
            font-size: 12px;
            margin-bottom: 3px;
        }
        .client-info {
            border-top: 1px solid #6b7280;
            padding-top: 10px;
            margin-top: 14px;
        }
        .title {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            margin: 16px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }
        th {
            background-color: #e5e7eb;
            border: 1px solid #9ca3af;
            padding: 6px;
            font-weight: 600;
            font-size: 13px;
        }
        td {
            font-size: 13px;
        }
        .total-row {
            font-weight: bold;
        }
        .total-words {
            text-align: center;
            font-size: 13px;
            margin: 20px 0;
            line-height: 1.5;
        }
        .thank-you {
            text-align: center;
            font-size: 13px;
            margin: 28px 0;
        }
        .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
        }
        .signature {
            text-align: center;
            font-size: 13px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <img src="${logoUrl}" alt="MDH Distribution Logo" class="logo" onerror="this.style.display='none'">
            <div class="contact">Email: mouctardh45@gmail.com</div>
            <div class="contact">Téléphone (+224) 620 03 77 78</div>
        </div>
        <div class="header-right">
            <p style="font-weight: 600; margin-bottom: 14px; font-size: 14px;">Date: ${formattedDate}</p>
            <div class="client-info">
                <p style="font-weight: bold; margin-bottom: 5px; font-size: 14px;">${order.full_name}</p>
                <p style="font-size: 12px;">${order.phone}</p>
                <p style="font-size: 12px;">${order.shipping_address}</p>
            </div>
        </div>
    </div>

    <h1 class="title">FACTURE DEFINITIVE</h1>

    <table>
        <thead>
            <tr>
                <th style="width: 40px;">N°</th>
                <th>DESIGNATION</th>
                <th style="width: 80px;">QUANTITE</th>
                <th style="width: 110px;">Prix Unitaire</th>
                <th style="width: 120px;">Prix Total</th>
            </tr>
        </thead>
        <tbody>
            ${itemsHTML}
            <tr class="total-row">
                <td colspan="4" style="border: 1px solid #9ca3af; padding: 6px 10px; text-align: right; font-size: 14px;">TOTAL</td>
                <td style="border: 1px solid #9ca3af; padding: 6px; text-align: right; white-space: nowrap; font-size: 15px;">
                    ${new Intl.NumberFormat('fr-GN').format(order.total)} GNF
                </td>
            </tr>
        </tbody>
    </table>

    <p class="total-words">
        Arrêté la présente facture à la somme de : <strong style="text-transform: capitalize;">${totalInWords} francs guinéens</strong>
    </p>

    <p class="thank-you">
        Nous vous remercions de nous avoir choisi et espérons vous revoir bientôt.
    </p>

    <div class="signatures">
        <div class="signature">
            <p style="margin-bottom: 60px;">Le Directeur Général</p>
        </div>
        <div class="signature">
            <p style="margin-bottom: 60px;">le Client</p>
        </div>
    </div>
</body>
</html>
    `;
}

/**
 * Convert number to French words
 */
function numberToWords(num) {
    const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
    const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

    if (num === 0) return 'zéro';

    const millions = Math.floor(num / 1000000);
    const thousands = Math.floor((num % 1000000) / 1000);
    const hundreds = Math.floor((num % 1000) / 100);
    const remainder = num % 100;

    let result = '';

    if (millions > 0) {
        result += (millions === 1 ? 'un million' : numberToWords(millions) + ' millions') + ' ';
    }

    if (thousands > 0) {
        result += (thousands === 1 ? 'mille' : numberToWords(thousands) + ' mille') + ' ';
    }

    if (hundreds > 0) {
        result += (hundreds === 1 ? 'cent' : units[hundreds] + ' cent') + ' ';
    }

    if (remainder >= 20) {
        const tensDigit = Math.floor(remainder / 10);
        const unitsDigit = remainder % 10;
        result += tens[tensDigit];
        if (unitsDigit > 0) {
            result += (tensDigit === 7 || tensDigit === 9 ? ' ' : '-') + units[unitsDigit];
        }
    } else if (remainder >= 10) {
        result += teens[remainder - 10];
    } else if (remainder > 0) {
        result += units[remainder];
    }

    return result.trim();
}

module.exports = {
    generateInvoicePDF
};
