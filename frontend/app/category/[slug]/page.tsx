import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { CategoryNav } from "@/components/category-nav"
import { ProductCard } from "@/components/product-card"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import { PaginationControls } from "@/components/ui/pagination-controls"

const ITEMS_PER_PAGE = 12

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const { page } = await searchParams
  const currentPage = Number(page) || 1

  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré")
  }

  const { data: category } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (!category) {
    notFound()
  }

  const from = (currentPage - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const { data: products, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("category_id", category.id)
    .order("name")
    .range(from, to)

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CategoryNav />

      <main className="flex-1">
        <div className="container px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold sm:text-4xl">{category.name}</h1>
            {category.description && <p className="mt-2 text-muted-foreground">{category.description}</p>}
          </div>

          {products && products.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
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
              <PaginationControls totalPages={totalPages} currentPage={currentPage} />
            </>
          ) : (
            <div className="py-16 text-center">
              <p className="text-base text-muted-foreground sm:text-lg">
                Aucun produit disponible dans cette catégorie pour le moment.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
