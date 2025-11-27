import { createServerSupabaseClient } from "@/lib/supabase/server"
import { checkAdminAccess } from "@/lib/admin-actions"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"
import { AdminProductsList } from "@/components/admin-products-list"
import Link from "next/link"
import { Plus } from "lucide-react"
import { PaginationControls } from "@/components/ui/pagination-controls"

const ITEMS_PER_PAGE = 12

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  await checkAdminAccess()
  const supabase = await createServerSupabaseClient()
  if (!supabase) throw new Error("❌ Supabase client not configured")

  // Récupérer les paramètres
  const { q, page } = await searchParams
  const searchQuery = (q as string) || ""
  const currentPage = Number(page) || 1

  // Calculer la plage de données
  const from = (currentPage - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  // Construire la requête
  let query = supabase
    .from("products")
    .select("*, categories(name)", { count: "exact" })
    .order("name")

  // Appliquer le filtre de recherche
  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`)
  }

  // Appliquer la pagination
  const { data: products, count } = await query.range(from, to)

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNav />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Gestion des produits</h1>
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau produit
              </Link>
            </Button>
          </div>

          <AdminProductsList products={products || []} />

          <PaginationControls totalPages={totalPages} currentPage={currentPage} />
        </div>
      </main>
    </div>
  )
}
