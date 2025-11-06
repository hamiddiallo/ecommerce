import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { CategoryNav } from "@/components/category-nav"
import { ProductCard } from "@/components/product-card"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default async function HomePage() {
  let products = null
  let error = null

  try {
    const supabase = await createServerSupabaseClient()

    if (supabase) {
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(12)

      products = data
      error = fetchError
    } else {
      error = new Error("Supabase not configured")
    }
  } catch (e) {
    console.error("Failed to fetch products:", e)
    error = e
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CategoryNav />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-gradient-to-b from-muted/50 to-background">
          <div className="container py-12 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Bienvenue sur Boutique Guinée
              </h1>
              <p className="mt-4 text-pretty text-lg text-muted-foreground md:text-xl">
                Découvrez notre large sélection de produits de qualité : cosmétiques, hygiène, fournitures scolaires,
                articles ménagers et bien plus encore.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <a href="#products">
                    Voir les produits
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/category/cosmetiques">Cosmétiques</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-12">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Nos Produits</h2>
                <p className="mt-2 text-muted-foreground">Découvrez notre sélection de produits populaires</p>
              </div>
            </div>

            {error ? (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
                <p className="text-destructive">
                  Impossible de charger les produits. Veuillez vérifier la configuration de la base de données.
                </p>
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    unit={product.unit}
                    image_url={product.image_url}
                    stock={product.stock}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Aucun produit disponible pour le moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/30 py-12">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mb-2 font-semibold">Produits de Qualité</h3>
                <p className="text-sm text-muted-foreground">
                  Nous sélectionnons uniquement des produits de qualité supérieure
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 font-semibold">Livraison Rapide</h3>
                <p className="text-sm text-muted-foreground">Recevez vos commandes rapidement partout en Guinée</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 font-semibold">Paiement Sécurisé</h3>
                <p className="text-sm text-muted-foreground">Vos transactions sont sécurisées et protégées</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
