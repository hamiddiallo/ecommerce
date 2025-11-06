import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { CategoryNav } from "@/components/category-nav"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Package } from "lucide-react"

export default async function OrdersPage() {
  const supabase = await createServerSupabaseClient()
    if (!supabase) {
      throw new Error("Supabase n'est pas configuré")
    }
  

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/orders")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

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
      <Header />
      <CategoryNav />

      <main className="flex-1">
        <div className="container py-8">
          <h1 className="mb-8 text-3xl font-bold">Mes Commandes</h1>

          {!orders || orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Package className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold">Aucune commande</h2>
              <p className="mb-6 text-muted-foreground">Vous n'avez pas encore passé de commande</p>
              <Button asChild>
                <Link href="/">Commencer mes achats</Link>
              </Button>
            </div>
          ) : (
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
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-xl font-bold text-primary">{formattedTotal}</p>
                        </div>
                        <Button asChild variant="outline">
                          <Link href={`/orders/${order.id}`}>Voir les détails</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
