import Link from "next/link"
import { LayoutDashboard, Package, ShoppingBag, LogOut, ExternalLink, FolderTree } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "./logout-button"

export function AdminNav() {
  return (
    <nav className="border-b bg-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">A</span>
            </div>
            <span className="hidden text-lg font-semibold sm:inline">Admin</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" asChild className="h-9">
              <Link href="/admin">
                <LayoutDashboard className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="h-9">
              <Link href="/admin/products">
                <Package className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Produits</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="h-9">
              <Link href="/admin/categories">
                <FolderTree className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Catégories</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="h-9">
              <Link href="/admin/orders">
                <ShoppingBag className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Commandes</span>
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild className="h-9">
              <Link href="/">
                <ExternalLink className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Voir le site</span>
              </Link>
            </Button>

            <LogoutButton iconOnly />
          </div>
        </div>
      </div>
    </nav>
  )
}
