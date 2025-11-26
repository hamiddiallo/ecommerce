import { createServerSupabaseClient } from "@/lib/supabase/server"
import { checkAdminAccess } from "@/lib/admin-actions"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"
import { AdminProductsList } from "@/components/admin-products-list"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function AdminProductsPage() {
  await checkAdminAccess()
  const supabase = await createServerSupabaseClient()
  if (!supabase) throw new Error("❌ Supabase client not configured")

  const { data: products } = await supabase.from("products").select("*, categories(name)").order("name")

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
        </div>
      </main>
    </div>
  )
}
