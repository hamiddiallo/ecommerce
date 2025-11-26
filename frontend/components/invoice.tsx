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
                <Button onClick={handlePrint} size="lg" className="shadow-lg">
                    <Printer className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Imprimer la facture</span>
                    <span className="sm:hidden">Imprimer</span>
                </Button>
            </div>

            {/* Invoice Content */}
            <div className="mx-auto max-w-4xl p-4 sm:p-6 md:p-8 print:p-0">
                {/* Header */}
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start justify-between border-b-2 border-gray-300 pb-4 sm:pb-6 gap-4 sm:gap-0">
                    <div className="w-full sm:w-auto">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1e3a8a] mb-3 sm:mb-4" style={{ fontFamily: 'serif' }}>
                            ETSMLF
                        </h1>
                        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">COMMERCE GENERALE</h2>
                        <p className="text-xs sm:text-sm mb-2">sise au grand marché central de labé</p>
                        <p className="text-[10px] sm:text-xs mb-1 break-words">NIF:393097985 N°FORMALITÉ/RCCM/GN.TCC.2024.07709</p>
                        <p className="text-[10px] sm:text-xs mb-2 sm:mb-3 break-words">N°ENTREPRISE/RCCM/GN.TCC.2024.A.06830</p>
                        <p className="text-sm sm:text-base font-semibold mb-1">(+224) 620 037 778</p>
                        <p className="text-sm sm:text-base break-all">mouctardh45@gmail.com</p>
                    </div>

                    <div className="w-full sm:w-auto sm:text-right">
                        <p className="text-xs sm:text-sm mb-2">Date : {formattedDate}</p>
                        <p className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Facture N° {invoiceNumber}</p>
                        <div className="border-t-2 border-gray-300 pt-3 sm:pt-4">
                            <p className="text-lg sm:text-xl font-bold break-words">{order.full_name}</p>
                            <p className="text-xs sm:text-sm mt-2 break-words">{order.shipping_address}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table - Responsive */}
                <div className="mb-6 overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#1e3a8a] text-white">
                                        <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">N°</th>
                                        <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">Désignation</th>
                                        <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">Qté</th>
                                        <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm hidden sm:table-cell">P.U</th>
                                        <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.order_items.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{index + 1}</td>
                                            <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                                                <div className="break-words">{item.product_name}</div>
                                                {/* Show unit price on mobile */}
                                                <div className="sm:hidden text-[10px] text-gray-600 mt-1">
                                                    {new Intl.NumberFormat("fr-GN").format(item.unit_price)} GNF × {item.quantity}
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">{item.quantity}</td>
                                            <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm hidden sm:table-cell whitespace-nowrap">
                                                {new Intl.NumberFormat("fr-GN").format(item.unit_price)} GNF
                                            </td>
                                            <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold whitespace-nowrap">
                                                {new Intl.NumberFormat("fr-GN").format(item.total_price)} GNF
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="font-bold bg-gray-50">
                                        <td colSpan={4} className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm sm:table-cell hidden">Total</td>
                                        <td colSpan={3} className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm sm:hidden">Total</td>
                                        <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-right text-sm sm:text-base whitespace-nowrap">
                                            {new Intl.NumberFormat("fr-GN").format(order.total)} GNF
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Total in Words */}
                <p className="mb-6 sm:mb-8 text-xs sm:text-sm break-words">
                    Arrêté la présente facture à la somme de : <span className="font-bold">{totalInWords} francs guinéens GNF</span>
                </p>

                {/* Thank You Message */}
                <p className="mb-8 sm:mb-12 text-xs sm:text-sm italic">
                    Nous vous remercions de nous avoir choisi et espérons vous revoir bientôt.
                </p>

                {/* Signatures */}
                <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-0">
                    <div>
                        <p className="font-semibold text-sm sm:text-base">Le Directeur Général</p>
                    </div>
                    <div className="sm:text-right">
                        <p className="font-semibold text-sm sm:text-base">Le client</p>
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
          /* Ensure table fits on print */
          table {
            font-size: 12px;
          }
          /* Show all columns when printing */
          .sm\\:table-cell {
            display: table-cell !important;
          }
          .sm\\:hidden {
            display: none !important;
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .overflow-x-auto {
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
        </div>
    )
}
