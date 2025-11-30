import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { CategoryNav } from "@/components/category-nav"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { redirect } from "next/navigation"

export default async function FavoritesPage() {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
        throw new Error("Supabase n'est pas configuré")
    }

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login?redirect=/favorites")
    }

    // Fetch favorites with product details
    const { data: favorites, error } = await supabase
        .from("favorites")
        .select(`
      id,
      product_id,
      created_at,
      products (
        id,
        name,
        price,
        unit,
        image_url,
        images,
        stock,
        category_id
      )
    `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    const favoriteProducts = favorites?.map((fav: any) => fav.products).filter(Boolean) || []

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <CategoryNav />

            <main className="flex-1 bg-muted/30">
                <div className="container px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold sm:text-4xl flex items-center gap-2">
                            <Heart className="h-8 w-8 fill-red-500 text-red-500" />
                            Mes Favoris
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            {favoriteProducts.length} produit{favoriteProducts.length > 1 ? "s" : ""}
                        </p>
                    </div>

                    {favoriteProducts.length === 0 ? (
                        <Card className="mx-auto max-w-md">
                            <CardContent className="flex flex-col items-center py-12 text-center">
                                <Heart className="mb-4 h-16 w-16 text-muted-foreground" />
                                <h2 className="mb-2 text-xl font-semibold">Aucun favori</h2>
                                <p className="mb-6 text-muted-foreground">
                                    Vous n'avez pas encore ajouté de produits à vos favoris
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
                            {favoriteProducts.map((product: any) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    price={product.price}
                                    unit={product.unit}
                                    image_url={product.image_url}
                                    images={product.images}
                                    stock={product.stock}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
