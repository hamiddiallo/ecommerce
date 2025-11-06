import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-semibold">Boutique Guinée</h3>
            <p className="text-sm text-muted-foreground">
              Votre boutique en ligne de confiance pour tous vos besoins quotidiens.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Catégories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/cosmetiques" className="text-muted-foreground hover:text-primary">
                  Cosmétiques
                </Link>
              </li>
              <li>
                <Link href="/category/hygiene" className="text-muted-foreground hover:text-primary">
                  Hygiène
                </Link>
              </li>
              <li>
                <Link href="/category/fournitures-scolaires" className="text-muted-foreground hover:text-primary">
                  Fournitures Scolaires
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Aide</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary">
                  Livraison
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Mon Compte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/login" className="text-muted-foreground hover:text-primary">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/auth/sign-up" className="text-muted-foreground hover:text-primary">
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-muted-foreground hover:text-primary">
                  Mes commandes
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Boutique Guinée. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
