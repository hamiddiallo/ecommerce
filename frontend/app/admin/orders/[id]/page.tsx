import { createServerSupabaseClient } from "@/lib/supabase/server"
import { checkAdminAccess } from "@/lib/admin-actions"
import { AdminNav } from "@/components/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OrderStatusSelect } from "@/components/order-status-select"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

// ✅ Types explicites pour corriger les erreurs TS
interface Product {
  name: string
  image_url: string | null
}

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  total_price: number
  products?: Product
}

interface Order {
  id: string
  status: string
  total: number
  created_at: string
  full_name: string
  phone: string
  shipping_address: string
  is_locked: boolean
  order_items: OrderItem[]
}

interface AdminOrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params

  await checkAdminAccess()

  const supabase = await createServerSupabaseClient()
  if (!supabase) throw new Error("❌ Supabase client not configured")

  // ✅ Récupération de la commande avec relations
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name, image_url))")
    .eq("id", id)
    .single<Order>()

  if (!order) {
    notFound()
  }

  // ✅ Formatage total et date
  const formattedTotal = new Intl.NumberFormat("fr-GN", {
    style: "currency",
    currency: "GNF",
    minimumFractionDigits: 0,
  }).format(order.total)

  const formattedDate = new Date(order.created_at).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNav />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          {/* Retour */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux commandes
            </Link>
          </Button>

          {/* En-tête commande */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Commande #{order.id.slice(0, 8)}</h1>
              <p className="mt-1 text-muted-foreground">{formattedDate}</p>
            </div>
            <Button asChild>
              <Link href={`/admin/orders/${order.id}/invoice`}>
                Générer la facture
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* ✅ Liste des articles */}
            <div className="space-y-4 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Articles commandés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.order_items.map((item: OrderItem) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={item.products?.image_url || "/placeholder.svg"}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantité: {item.quantity}
                        </p>
                        <p className="mt-1 font-semibold">
                          {new Intl.NumberFormat("fr-GN", {
                            style: "currency",
                            currency: "GNF",
                            minimumFractionDigits: 0,
                          }).format(item.total_price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* ✅ Infos commande */}
            <div className="space-y-4 lg:col-span-1">
              {/* Statut */}
              <Card>
                <CardHeader>
                  <CardTitle>Statut de la commande</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status} isLocked={order.is_locked} />
                </CardContent>
              </Card>

              {/* Résumé */}
              <Card>
                <CardHeader>
                  <CardTitle>Résumé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-medium">{formattedTotal}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-primary">{formattedTotal}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium">{order.full_name}</p>
                    <p className="text-muted-foreground">{order.phone}</p>
                  </div>
                  <div>
                    <p className="font-medium">Adresse de livraison</p>
                    <p className="text-muted-foreground">{order.shipping_address}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
