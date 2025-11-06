import { createServerSupabaseClient } from "@/lib/supabase/server"
import { checkAdminAccess } from "@/lib/admin-actions"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil } from "lucide-react"
import { DeleteProductButton } from "@/components/delete-product-button"

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

          {products && products.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                const formattedPrice = new Intl.NumberFormat("fr-GN", {
                  style: "currency",
                  currency: "GNF",
                  minimumFractionDigits: 0,
                }).format(product.price)

                return (
                  <Card key={product.id}>
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.categories?.name}</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-bold text-primary">{formattedPrice}</span>
                        <span className="text-sm text-muted-foreground">/ {product.unit}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">Stock: {product.stock}</p>

                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                          <Link href={`/admin/products/${product.id}`}>
                            <Pencil className="mr-2 h-3 w-3" />
                            Modifier
                          </Link>
                        </Button>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Aucun produit disponible</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
