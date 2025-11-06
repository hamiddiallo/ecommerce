import Link from "next/link"
import { Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CartIcon } from "@/components/cart-icon"
import { Suspense } from "react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">H S</span>
          </div>
          <span className="text-xl font-semibold">Hamid Shop</span>
        </Link>

        <div className="hidden flex-1 items-center justify-center px-8 md:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher des produits..." className="pl-10" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/auth/login">
              <User className="h-5 w-5" />
              <span className="sr-only">Compte</span>
            </Link>
          </Button>
          <Suspense
            fallback={
              <Button variant="ghost" size="icon" asChild>
                <Link href="/cart">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>
            }
          >
            <CartIcon />
          </Suspense>
        </div>
      </div>
    </header>
  )
}
