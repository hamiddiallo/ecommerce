import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { CategoryNav } from "@/components/category-nav"
import { ProductCard } from "@/components/product-card"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Search as SearchIcon } from "lucide-react"
import { PaginationControls } from "@/components/ui/pagination-controls"

interface SearchPageProps {
    searchParams: Promise<{
        q?: string
        page?: string
    }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q, page } = await searchParams
    const searchQuery = q || ""
    const currentPage = Number(page) || 1
    const limit = 12

    let products = []
    let totalPages = 0
    let error = null

    if (searchQuery) {
        try {
            const res = await fetch(
                `http://localhost:5000/api/products?search=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=${limit}`,
                { cache: "no-store" }
            )

            if (!res.ok) {
                throw new Error("Failed to fetch products")
            }

            const responseData = await res.json()
            products = Array.isArray(responseData) ? responseData : (responseData.data || [])
            totalPages = responseData.meta?.totalPages || 0
        } catch (e) {
            console.error("Failed to fetch products:", e)
            error = e
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <CategoryNav />

            <main className="flex-1">
                <div className="container py-8">
                    <Button variant="ghost" asChild className="mb-6">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour à l'accueil
                        </Link>
                    </Button>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">
                            {searchQuery ? `Résultats pour "${searchQuery}"` : "Recherche"}
                        </h1>
                        {searchQuery && products.length > 0 && (
                            <p className="mt-2 text-muted-foreground">
                                {products.length} produit{products.length > 1 ? "s" : ""} trouvé{products.length > 1 ? "s" : ""}
                            </p>
                        )}
                    </div>

                    {!searchQuery ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <SearchIcon className="mb-4 h-16 w-16 text-muted-foreground" />
                            <h2 className="text-xl font-semibold">Aucune recherche effectuée</h2>
                            <p className="mt-2 text-muted-foreground">
                                Utilisez la barre de recherche ci-dessus pour trouver des produits
                            </p>
                        </div>
                    ) : error ? (
                        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
                            <p className="text-destructive">
                                Impossible de charger les résultats. Veuillez réessayer.
                            </p>
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                            <PaginationControls totalPages={totalPages} currentPage={currentPage} />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <SearchIcon className="mb-4 h-16 w-16 text-muted-foreground" />
                            <h2 className="text-xl font-semibold">Aucun résultat trouvé</h2>
                            <p className="mt-2 text-muted-foreground">
                                Essayez avec d'autres mots-clés
                            </p>
                            <Button asChild className="mt-4">
                                <Link href="/">Retour à l'accueil</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
