import Link from "next/link"
import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminNav() {
  return (
    <nav className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">MLF</span>
          </div>
          <span className="text-xl font-semibold">Admin</span>
        </Link>

        <div className="flex gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Tableau de bord
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/products">
              <Package className="mr-2 h-4 w-4" />
              Produits
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Commandes
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">Voir le site</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/auth/logout">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Link>
        </Button>
      </div>
    </nav>
  )
}
