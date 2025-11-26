"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

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
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })

    const totalInWords = numberToWords(Math.floor(order.total))

    return (
        <div className="min-h-screen bg-white">
            {/* Print Button - Hidden when printing */}
            <div className="print:hidden fixed top-4 right-4 z-50">
                <Button onClick={handlePrint} size="lg">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimer la facture
                </Button>
            </div>

            {/* Invoice Content */}
            <div className="mx-auto max-w-4xl p-8 print:p-0">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between border-b-2 border-gray-300 pb-6">
                    <div>
                        <h1 className="text-5xl font-bold text-[#1e3a8a] mb-4" style={{ fontFamily: 'serif' }}>
                            ETSMLF
                        </h1>
                        <h2 className="text-xl font-semibold mb-4">COMMERCE GENERALE</h2>
                        <p className="text-sm mb-2">sise au grand marché central de labé</p>
                        <p className="text-xs mb-1">NIF:393097985 N°FORMALITÉ/RCCM/GN.TCC.2024.07709</p>
                        <p className="text-xs mb-3">N°ENTREPRISE/RCCM/GN.TCC.2024.A.06830</p>
                        <p className="text-base font-semibold mb-1">(+224) 620 037 778</p>
                        <p className="text-base">mouctardh45@gmail.com</p>
                    </div>

                    <div className="text-right">
                        <p className="text-sm mb-2">Date : {formattedDate}</p>
                        <p className="text-lg font-bold mb-6">Facture N° {invoiceNumber}</p>
                        <div className="border-t-2 border-gray-300 pt-4">
                            <p className="text-xl font-bold">{order.full_name}</p>
                            <p className="text-sm mt-2">{order.shipping_address}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-6 border-collapse">
                    <thead>
                        <tr className="bg-[#1e3a8a] text-white">
                            <th className="border border-gray-300 px-4 py-3 text-left">N°</th>
                            <th className="border border-gray-300 px-4 py-3 text-left">Désignation</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">Quantité</th>
                            <th className="border border-gray-300 px-4 py-3 text-right">Prix Unitaire</th>
                            <th className="border border-gray-300 px-4 py-3 text-right">Prix Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.order_items.map((item, index) => (
                            <tr key={item.id}>
                                <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
                                <td className="border border-gray-300 px-4 py-3">{item.product_name}</td>
                                <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                                <td className="border border-gray-300 px-4 py-3 text-right">
                                    {new Intl.NumberFormat("fr-GN").format(item.unit_price)} GNF
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-right">
                                    {new Intl.NumberFormat("fr-GN").format(item.total_price)} GNF
                                </td>
                            </tr>
                        ))}
                        <tr className="font-bold">
                            <td colSpan={4} className="border border-gray-300 px-4 py-3 text-left">Total</td>
                            <td className="border border-gray-300 px-4 py-3 text-right">
                                {new Intl.NumberFormat("fr-GN").format(order.total)} GNF
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Total in Words */}
                <p className="mb-8 text-sm">
                    Arrêté la présente facture à la somme de : <span className="font-bold">{totalInWords} francs guinéens GNF</span>
                </p>

                {/* Thank You Message */}
                <p className="mb-12 text-sm italic">
                    Nous vous remercions de nous avoir choisi et espérons vous revoir bientôt.
                </p>

                {/* Signatures */}
                <div className="flex justify-between">
                    <div>
                        <p className="font-semibold">Le Directeur Général</p>
                    </div>
                    <div>
                        <p className="font-semibold">Le client</p>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
        </div>
    )
}
