import Link from "next/link"
import { ShoppingCart, LogIn, UserPlus, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartIcon } from "@/components/cart-icon"
import { Suspense } from "react"
import { SearchBar } from "@/components/search-bar"
import { UserMenu } from "@/components/user-menu"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function Header() {
  // Check if user is authenticated and if admin
  let isAuthenticated = false
  let isAdmin = false

  try {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        isAuthenticated = true
        const { data: adminUser } = await supabase
          .from("admin_users")
          .select("id")
          .eq("id", user.id)
          .single()
        isAdmin = !!adminUser
      }
    }
  } catch (e) {
    // Ignore errors
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">ETS</span>
          </div>
          <span className="hidden text-xl font-semibold sm:inline">MLF</span>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden flex-1 items-center justify-center px-4 md:flex lg:px-8">
          <SearchBar />
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Home Button */}
          <Button variant="ghost" size="sm" asChild className="h-9">
            <Link href="/homepage">
              <Home className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Accueil</span>
            </Link>
          </Button>

          {/* User Menu for authenticated non-admin users */}
          {isAuthenticated && !isAdmin && <UserMenu />}

          {/* Cart Icon for authenticated non-admin users */}
          {isAuthenticated && !isAdmin && (
            <Suspense
              fallback={
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/cart">
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                </Button>
              }
            >
              <CartIcon />
            </Suspense>
          )}

          {/* Login/Signup buttons for non-authenticated users */}
          {!isAuthenticated && (
            <>
              <Button variant="ghost" size="sm" asChild className="h-9">
                <Link href="/auth/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Connexion</span>
                </Link>
              </Button>
              <Button size="sm" asChild className="h-9">
                <Link href="/auth/sign-up">
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Inscription</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
