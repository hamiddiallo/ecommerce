import { createServerSupabaseClient } from "@/lib/supabase/server"
import { checkAdminAccess } from "@/lib/admin-actions"
import { AdminNav } from "@/components/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingBag, TrendingUp, Users } from "lucide-react"

export default async function AdminDashboard() {
  await checkAdminAccess()
  const supabase = await createServerSupabaseClient()
if (!supabase) {
  throw new Error("Supabase n'est pas configuré")
}


  // Get statistics
  const { count: productsCount } = await supabase.from("products").select("*", { count: "exact", head: true })

  const { count: ordersCount } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { count: pendingOrdersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("total")
    .order("created_at", { ascending: false })
    .limit(10)

  const totalRevenue = recentOrders?.reduce((sum, order) => sum + order.total, 0) || 0

  const formattedRevenue = new Intl.NumberFormat("fr-GN", {
    style: "currency",
    currency: "GNF",
    minimumFractionDigits: 0,
  }).format(totalRevenue)

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNav />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <h1 className="mb-8 text-3xl font-bold">Tableau de bord</h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productsCount || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ordersCount || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Commandes en attente</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrdersCount || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenus récents</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formattedRevenue}</div>
                <p className="text-xs text-muted-foreground">10 dernières commandes</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentOrdersList />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

async function RecentOrdersList() {
  const supabase = await createServerSupabaseClient()
if (!supabase) {
  throw new Error("Supabase n'est pas configuré")
}


  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5)

  if (!orders || orders.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune commande récente</p>
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const formattedTotal = new Intl.NumberFormat("fr-GN", {
          style: "currency",
          currency: "GNF",
          minimumFractionDigits: 0,
        }).format(order.total)

        const formattedDate = new Date(order.created_at).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })

        return (
          <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
            <div>
              <p className="font-medium">#{order.id.slice(0, 8)}</p>
              <p className="text-sm text-muted-foreground">{order.full_name}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formattedTotal}</p>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
