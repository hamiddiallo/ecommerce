import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { CategoryNav } from "@/components/category-nav"
import { Footer } from "@/components/footer"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProductGallery } from "@/components/product-gallery"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré")
  }

  const { data: product } = await supabase.from("products").select("*, categories(name, slug)").eq("id", id).single()

  if (!product) {
    notFound()
  }

  const formattedPrice = new Intl.NumberFormat("fr-GN", {
    style: "currency",
    currency: "GNF",
    minimumFractionDigits: 0,
  }).format(product.price)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CategoryNav />

      <main className="flex-1">
        <div className="container px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux produits
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Product Images */}
            <ProductGallery
              images={product.images && product.images.length > 0 ? product.images : [product.image_url]}
              name={product.name}
            />

            {/* Product Info */}
            <div className="flex flex-col">
              {product.categories && (
                <Link
                  href={`/category/${product.categories.slug}`}
                  className="mb-2 text-sm text-muted-foreground hover:text-primary"
                >
                  {product.categories.name}
                </Link>
              )}

              <h1 className="text-3xl font-bold sm:text-4xl">{product.name}</h1>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary sm:text-5xl">{formattedPrice}</span>
                <span className="text-lg text-muted-foreground">/ {product.unit}</span>
              </div>

              {/* Stock Status */}
              <div className="mt-6">
                {product.stock > 10 && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Package className="h-4 w-4" />
                    <span>En stock ({product.stock} disponibles)</span>
                  </div>
                )}
                {product.stock <= 10 && product.stock > 0 && (
                  <div className="flex items-center gap-2 text-sm text-orange-600">
                    <Package className="h-4 w-4" />
                    <span>Stock limité (plus que {product.stock})</span>
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <Package className="h-4 w-4" />
                    <span>Rupture de stock</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mt-8">
                  <h2 className="mb-3 text-lg font-semibold">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Add to Cart */}
              <div className="mt-8">
                <AddToCartButton
                  productId={product.id}
                  productName={product.name}
                  stock={product.stock}
                  className="w-full py-6 text-lg"
                />
              </div>

              {/* Additional Info */}
              <div className="mt-8 space-y-4">
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <Truck className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Livraison</h3>
                      <p className="text-sm text-muted-foreground">Livraison disponible partout en Guinée</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div >
  )
}
