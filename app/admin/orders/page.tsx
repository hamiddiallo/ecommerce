import { createServerSupabaseClient } from "@/lib/supabase/server"
import { checkAdminAccess } from "@/lib/admin-actions"
import { AdminNav } from "@/components/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminOrdersPage() {
  await checkAdminAccess()
  const supabase = await createServerSupabaseClient()
    if (!supabase) throw new Error("❌ Supabase client not configured")

  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
    }

    const labels: Record<string, string> = {
      pending: "En attente",
      confirmed: "Confirmée",
      shipped: "Expédiée",
      delivered: "Livrée",
      cancelled: "Annulée",
    }

    return <Badge variant={variants[status] || "outline"}>{labels[status] || status}</Badge>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNav />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <h1 className="mb-8 text-3xl font-bold">Gestion des commandes</h1>

          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
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
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">Commande #{order.id.slice(0, 8)}</CardTitle>
                          <p className="text-sm text-muted-foreground">{formattedDate}</p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.full_name}</p>
                          <p className="text-sm text-muted-foreground">{order.phone}</p>
                          <p className="mt-2 text-xl font-bold text-primary">{formattedTotal}</p>
                        </div>
                        <Button asChild variant="outline" className="bg-transparent">
                          <Link href={`/admin/orders/${order.id}`}>Voir les détails</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Aucune commande</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
