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
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">ETS</span>
          </div>
          <span className="text-xl font-semibold"> MLF</span>
        </Link>

        <div className="hidden flex-1 items-center justify-center px-8 md:flex">
          <SearchBar />
        </div>
        <Button variant="ghost" asChild>
          <Link href="/homepage">
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {/* Show user menu only for authenticated non-admin users */}
          {isAuthenticated && !isAdmin && <UserMenu />}

          {/* Show login/signup buttons for non-authenticated users */}
          {!isAuthenticated && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Connexion
                </Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Inscription
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
