import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function CategoryNav() {
  const supabase = await createServerSupabaseClient()
      if (!supabase) {
        throw new Error("Supabase n'est pas configuré")
      }
  if (!supabase) {
    return null
  }

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <nav className="border-b bg-muted/30">
      <div className="container">
        <ul className="flex gap-6 overflow-x-auto py-3 text-sm">
          <li>
            <Link href="/" className="whitespace-nowrap font-medium text-foreground hover:text-primary">
              Tous les produits
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/category/${category.slug}`}
                className="whitespace-nowrap text-muted-foreground hover:text-primary"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
