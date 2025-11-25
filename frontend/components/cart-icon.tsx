import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCartCount } from "@/lib/cart-actions"

export async function CartIcon() {
  const count = await getCartCount()

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {count > 9 ? "9+" : count}
          </span>
        )}
        <span className="sr-only">Panier ({count})</span>
      </Link>
    </Button>
  )
}
