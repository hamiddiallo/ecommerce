"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import Image from "next/image"

interface OrderItem {
    id: string
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
}

interface Order {
    id: string
    created_at: string
    full_name: string
    phone: string
    shipping_address: string
    total: number
    invoice_number?: string
    order_items: OrderItem[]
}

interface InvoiceProps {
    order: Order
}

// Fonction pour convertir un nombre en lettres (français)
function numberToWords(num: number): string {
    const units = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"]
    const teens = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"]
    const tens = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"]

    if (num === 0) return "zéro"

    const millions = Math.floor(num / 1000000)
    const thousands = Math.floor((num % 1000000) / 1000)
    const hundreds = Math.floor((num % 1000) / 100)
    const remainder = num % 100

    let result = ""

    if (millions > 0) {
        result += (millions === 1 ? "un million" : numberToWords(millions) + " millions") + " "
    }

    if (thousands > 0) {
        result += (thousands === 1 ? "mille" : numberToWords(thousands) + " mille") + " "
    }

    if (hundreds > 0) {
        result += (hundreds === 1 ? "cent" : units[hundreds] + " cent") + " "
    }

    if (remainder >= 20) {
        const tensDigit = Math.floor(remainder / 10)
        const unitsDigit = remainder % 10
        result += tens[tensDigit]
        if (unitsDigit > 0) {
            result += (tensDigit === 7 || tensDigit === 9 ? " " : "-") + units[unitsDigit]
        }
    } else if (remainder >= 10) {
        result += teens[remainder - 10]
    } else if (remainder > 0) {
        result += units[remainder]
    }

    return result.trim()
}

export function Invoice({ order }: InvoiceProps) {
    const handlePrint = () => {
        window.print()
    }

    // Utiliser le numéro de facture fourni ou générer un par défaut
    const invoiceNumber = order.invoice_number || `000xk${order.id.slice(0, 3).toUpperCase()}`
    const formattedDate = new Date(order.created_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    })

    const totalInWords = numberToWords(Math.floor(order.total))

    return (
        <div className="min-h-screen bg-white">
            {/* Print Button - Hidden when printing */}
            <div className="print:hidden fixed top-4 right-4 z-50">
                <Button onClick={handlePrint} size="lg" className="shadow-lg">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimer
                </Button>
            </div>

            {/* Invoice Content */}
            <div className="invoice-wrapper">
                <div className="invoice-content">
                    {/* Header with Logo and Info */}
                    <div className="mb-3 flex items-start justify-between">
                        {/* Left: Logo and Contact */}
                        <div className="w-1/2">
                            <img
                                src="/uploads/logoFacture2.jpg"
                                alt="MDH Distribution Logo"
                                className="h-auto w-full max-w-[200px] mb-2"
                            />
                            <div className="text-xs">
                                <p className="mb-0.5">Email: mouctardh45@gmail.com</p>
                                <p>Téléphone (+224) 620 03 77 78</p>
                            </div>
                        </div>

                        {/* Right: Date and Client Info */}
                        <div className="text-right text-xs w-1/2">
                            <p className="font-semibold mb-3">Date: {formattedDate}</p>
                            <div className="border-t border-gray-400 pt-2">
                                <p className="font-bold mb-1">{order.full_name}</p>
                                <p className="text-xs">{order.phone}</p>
                                <p className="text-xs">{order.shipping_address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="mb-3 text-center text-xl font-bold">FACTURE DEFINITIVE</h1>

                    {/* Items Table */}
                    <div className="mb-2">
                        <table className="w-full border-collapse text-xs">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-400 px-1 py-1 text-left font-semibold w-8">N°</th>
                                    <th className="border border-gray-400 px-2 py-1 text-left font-semibold">DESIGNATION</th>
                                    <th className="border border-gray-400 px-1 py-1 text-center font-semibold w-16">QUANTITE</th>
                                    <th className="border border-gray-400 px-1 py-1 text-right font-semibold w-24">Prix Unitaire</th>
                                    <th className="border border-gray-400 px-1 py-1 text-right font-semibold w-28">Prix Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.order_items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="border border-gray-400 px-1 py-0.5 text-center">{index + 1}</td>
                                        <td className="border border-gray-400 px-2 py-0.5">{item.product_name}</td>
                                        <td className="border border-gray-400 px-1 py-0.5 text-center">{item.quantity}</td>
                                        <td className="border border-gray-400 px-1 py-0.5 text-right whitespace-nowrap">
                                            {new Intl.NumberFormat("fr-GN").format(item.unit_price)} GNF
                                        </td>
                                        <td className="border border-gray-400 px-1 py-0.5 text-right whitespace-nowrap">
                                            {new Intl.NumberFormat("fr-GN").format(item.total_price)} GNF
                                        </td>
                                    </tr>
                                ))}
                                {/* Total Row */}
                                <tr className="font-bold">
                                    <td colSpan={4} className="border border-gray-400 px-2 py-1 text-right">TOTAL</td>
                                    <td className="border border-gray-400 px-1 py-1 text-right whitespace-nowrap text-sm">
                                        {new Intl.NumberFormat("fr-GN").format(order.total)} GNF
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Total in Words */}
                    <p className="mb-4 text-xs text-center">
                        Arrêté la présente facture à la somme de : <span className="font-bold capitalize">{totalInWords} francs guinéens</span>
                    </p>

                    {/* Thank You Message */}
                    <p className="mb-6 text-xs text-center">
                        Nous vous remercions de nous avoir choisi et espérons vous revoir bientôt.
                    </p>

                    {/* Signatures */}
                    <div className="flex justify-between items-end">
                        <div className="text-center">
                            <p className="text-xs font-semibold mb-12">Le Directeur Général</p>
                            {/* Espace pour signature/cachet */}
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-semibold mb-12">le Client</p>
                            {/* Espace pour signature */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                /* Invoice wrapper */
                .invoice-wrapper {
                    width: 100%;
                    padding: 0.5rem;
                }
                
                .invoice-content {
                    width: 210mm; /* A4 width */
                    max-width: 100%;
                    margin: 0 auto;
                    padding: 0.5cm 0.5cm; /* Reduced margins */
                }
                
                /* Scale down on mobile */
                @media (max-width: 800px) {
                    .invoice-wrapper {
                        padding: 0.25rem;
                    }
                    .invoice-content {
                        transform: scale(calc(100vw / 850));
                        transform-origin: top center;
                    }
                }
                
                @media print {
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .invoice-wrapper {
                        padding: 0;
                    }
                    .invoice-content {
                        transform: none;
                        width: 100%;
                        padding: 0.3cm 0.5cm; /* Minimal margins for print */
                    }
                    @page {
                        size: A4;
                        margin: 0.3cm 0.5cm; /* Minimal page margins */
                    }
                    /* Ensure table rows don't break across pages */
                    tr {
                        page-break-inside: avoid;
                    }
                }
            `}</style>
        </div>
    )
}
