import { createServerSupabaseClient } from "@/lib/supabase/server"
import { checkAdminAccess } from "@/lib/admin-actions"
import { AdminNav } from "@/components/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PaginationControls } from "@/components/ui/pagination-controls"

const ITEMS_PER_PAGE = 10

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  await checkAdminAccess()
  const supabase = await createServerSupabaseClient()
  if (!supabase) throw new Error("❌ Supabase client not configured")

  // Récupérer les paramètres
  const { status, page } = await searchParams
  const statusFilter = (status as string) || "all"
  const currentPage = Number(page) || 1

  // Calculer la plage de données pour la pagination
  const from = (currentPage - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  // Construire la requête de base
  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })

  // Appliquer le filtre si différent de "all"
  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter)
  }

  // Appliquer la pagination
  const { data: orders, count } = await query.range(from, to)

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0

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

  // Options de filtre pour les statuts
  const statusFilters = [
    { value: "all", label: "Toutes les commandes" },
    { value: "pending", label: "En attente" },
    { value: "confirmed", label: "Confirmées" },
    { value: "shipped", label: "Expédiées" },
    { value: "delivered", label: "Livrées" },
    { value: "cancelled", label: "Annulées" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNav />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <h1 className="mb-8 text-3xl font-bold">Gestion des commandes</h1>

          {/* Filtres par statut */}
          <div className="mb-6 flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <Button
                key={filter.value}
                asChild
                variant={statusFilter === filter.value ? "default" : "outline"}
                size="sm"
              >
                <Link href={`/admin/orders?status=${filter.value}`}>
                  {filter.label}
                </Link>
              </Button>
            ))}
          </div>

          {orders && orders.length > 0 ? (
            <>
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

              <PaginationControls totalPages={totalPages} currentPage={currentPage} />
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {statusFilter === "all"
                    ? "Aucune commande"
                    : `Aucune commande avec le statut "${statusFilters.find(f => f.value === statusFilter)?.label}"`
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}