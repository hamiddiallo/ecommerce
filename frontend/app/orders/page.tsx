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
import { OrdersFilter } from "@/components/orders-filter"

// Options de filtre pour les statuts
const statusFilters = [
  { value: "all", label: "Toutes mes commandes" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmées" },
  { value: "shipped", label: "Expédiées" },
  { value: "delivered", label: "Livrées" },
  { value: "cancelled", label: "Annulées" },
]

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
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

  // Récupérer le filtre de statut depuis les paramètres de recherche
  const statusFilter = searchParams.status as string || "all"

  // Construire la requête en fonction du filtre
  // Note: Backend filtering not fully implemented yet, fetching all and filtering in JS for now or updating backend
  // For now, let's fetch all and filter here or pass query param if backend supports it
  // I'll update backend to support status filter later if needed, but for now let's just fetch all

  const res = await fetch(`http://localhost:5000/api/orders?userId=${user.id}`, {
    cache: "no-store",
  })

  let orders = res.ok ? await res.json() : []

  // Appliquer le filtre si différent de "all"
  if (statusFilter !== "all") {
    orders = orders.filter((o: any) => o.status === statusFilter)
  }

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

  // Trouver le label du filtre actuel
  const currentFilterLabel = statusFilters.find(f => f.value === statusFilter)?.label || ""

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {await CategoryNav()}

      <main className="flex-1">
        <div className="container py-8">
          <h1 className="mb-8 text-3xl font-bold">Mes Commandes</h1>

          {/* Utilisation du composant client pour le filtre */}
          <OrdersFilter currentStatus={statusFilter} />

          {!orders || orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Package className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold">
                {statusFilter === "all"
                  ? "Aucune commande"
                  : `Aucune commande ${currentFilterLabel.toLowerCase()}`
                }
              </h2>
              <p className="mb-6 text-muted-foreground text-center">
                {statusFilter === "all"
                  ? "Vous n'avez pas encore passé de commande"
                  : `Vous n'avez pas de commande avec le statut "${currentFilterLabel}"`
                }
              </p>
              <Button asChild>
                <Link href="/">Commencer mes achats</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Indicateur du filtre actif */}
              {statusFilter !== "all" && (
                <div className="text-sm text-muted-foreground">
                  Affichage des commandes : <span className="font-medium">{currentFilterLabel}</span>
                  {" "}({orders.length} commande{orders.length > 1 ? 's' : ''})
                </div>
              )}

              {orders.map((order: any) => {
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