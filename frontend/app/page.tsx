import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { CategoryNav } from "@/components/category-nav"
import { ProductCard } from "@/components/product-card"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, LayoutDashboard } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  let products = null
  let error = null
  let isAdmin = false

  // Check if user is admin
  try {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: adminUser } = await supabase
          .from("admin_users")
          .select("id")
          .eq("id", user.id)
          .single()
        isAdmin = !!adminUser
      }
    }
  } catch (e) {
    // Ignore admin check errors
  }

  try {
    const res = await fetch("http://localhost:5000/api/products", {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch products")
    }

    products = await res.json()
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
          <div className="container px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Bienvenue sur Boutique Guinée
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg md:text-xl">
                Découvrez notre large sélection de produits de qualité : cosmétiques, hygiène, fournitures scolaires,
                articles ménagers et bien plus encore.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                {isAdmin && (
                  <Button size="lg" variant="default" asChild>
                    <Link href="/admin">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard Admin
                    </Link>
                  </Button>
                )}
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
        <section id="products" className="py-16 sm:py-20">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center sm:text-left">
              <h2 className="text-3xl font-bold sm:text-4xl">Nos Produits</h2>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                Découvrez notre sélection de produits populaires
              </p>
            </div>

            {error ? (
              <div className="mx-auto max-w-2xl rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
                <p className="text-destructive">
                  Impossible de charger les produits. Veuillez vérifier la configuration de la base de données.
                </p>
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product: any) => (
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
              <div className="py-16 text-center">
                <p className="text-base text-muted-foreground sm:text-lg">
                  Aucun produit disponible pour le moment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/30 py-16 sm:py-20">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold">Produits de Qualité</h3>
                <p className="text-sm text-muted-foreground sm:text-base">
                  Nous sélectionnons uniquement des produits de qualité supérieure
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold">Livraison Rapide</h3>
                <p className="text-sm text-muted-foreground sm:text-base">
                  Recevez vos commandes rapidement partout en Guinée
                </p>
              </div>
              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold">Paiement Sécurisé</h3>
                <p className="text-sm text-muted-foreground sm:text-base">
                  Vos transactions sont sécurisées et protégées
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
