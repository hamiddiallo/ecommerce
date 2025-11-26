import { createServerSupabaseClient } from "@/lib/supabase/server"
import { checkAdminAccess } from "@/lib/admin-actions"
import { notFound } from "next/navigation"
import { Invoice } from "@/components/invoice"

interface InvoicePageProps {
    params: Promise<{
        id: string
    }>
}

// Types pour la réponse Supabase
interface SupabaseProduct {
    name: string
    image_url: string | null
}

interface SupabaseOrderItem {
    id: string
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
    products: SupabaseProduct | null
}

interface SupabaseOrder {
    id: string
    created_at: string
    full_name: string
    phone: string
    shipping_address: string
    total: number
    order_items: SupabaseOrderItem[]
}

export default async function InvoicePage({ params }: InvoicePageProps) {
    try {
        const { id } = await params

        // Vérifier l'accès admin
        await checkAdminAccess()

        const supabase = await createServerSupabaseClient()
        if (!supabase) {
            console.error("❌ Supabase client not configured")
            throw new Error("Configuration error")
        }

        // Récupérer la commande
        const { data: order, error } = await supabase
            .from("orders")
            .select("*, order_items(*, products(name, image_url))")
            .eq("id", id)
            .single<SupabaseOrder>()

        if (error) {
            console.error("❌ Error fetching order:", error)
            notFound()
        }

        if (!order) {
            console.error("❌ Order not found:", id)
            notFound()
        }

        // Valider que order_items existe et est un tableau
        if (!order.order_items || !Array.isArray(order.order_items)) {
            console.error("❌ Invalid order_items:", order.order_items)
            notFound()
        }

        // Calculer le numéro de facture séquentiel basé sur l'année
        const orderYear = new Date(order.created_at).getFullYear()
        const startOfYear = new Date(orderYear, 0, 1).toISOString()
        const endOfYear = new Date(orderYear, 11, 31, 23, 59, 59).toISOString()

        // Compter les commandes créées avant celle-ci dans la même année
        const { count } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startOfYear)
            .lte("created_at", order.created_at)

        // Le numéro séquentiel est le nombre de commandes + 1 (incluant celle-ci)
        const sequentialNumber = (count || 0)
        const invoiceNumber = `ETSMLF-${orderYear}-${String(sequentialNumber).padStart(3, "0")}`

        // Transformer les données pour le composant Invoice
        const transformedOrder = {
            id: order.id,
            created_at: order.created_at,
            full_name: order.full_name,
            phone: order.phone,
            shipping_address: order.shipping_address,
            total: Number(order.total) || 0,
            invoice_number: invoiceNumber,
            order_items: order.order_items.map(item => ({
                id: item.id,
                product_name: item.product_name || "Produit inconnu",
                quantity: Number(item.quantity) || 0,
                unit_price: Number(item.unit_price) || 0,
                total_price: Number(item.total_price) || 0
            }))
        }

        console.log("✅ Invoice data prepared for order:", id, "- Invoice number:", invoiceNumber)

        return <Invoice order={transformedOrder} />
    } catch (error) {
        console.error("❌ Error in InvoicePage:", error)
        // Si c'est une erreur notFound, la relancer
        if (error instanceof Error && error.message === "NEXT_NOT_FOUND") {
            throw error
        }
        // Sinon, afficher une page 404
        notFound()
    }
}
