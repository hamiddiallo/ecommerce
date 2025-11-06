import { createServerSupabaseClient } from "@/lib/supabase/server"
import { checkAdminAccess } from "@/lib/admin-actions"
import { AdminNav } from "@/components/admin-nav"
import { ProductForm } from "@/components/product-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function NewProductPage() {
  await checkAdminAccess()
   const supabase = await createServerSupabaseClient()
      if (!supabase) throw new Error("❌ Supabase client not configured")

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNav />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <h1 className="mb-8 text-3xl font-bold">Nouveau produit</h1>

          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>Informations du produit</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm categories={categories || []} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
