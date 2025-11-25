import Link from "next/link"

export async function CategoryNav() {
  const res = await fetch("http://localhost:5000/api/categories", {
    cache: "no-store",
  })

  const categories = res.ok ? await res.json() : []

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
          {categories.map((category: any) => (
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
