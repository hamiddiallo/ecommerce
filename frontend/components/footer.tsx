import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-semibold">MDH Distribution</h3>
            <p className="text-sm text-muted-foreground">
              Votre boutique de confiance pour tous vos besoins quotidiens.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Produits
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-foreground">
                  Panier
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: mouctardh45@gmail.com</li>
              <li>Tél: (+224) 620 03 77 78</li>
              <li>Adresse: Grand marché central de Labé</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Informations légales</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>NIF: 393097985</li>
              <li>RCCM: GN.TCC.2024.07709</li>
              <li>N°ENTREPRISE: GN.TCC.2024.A.06830</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 MDH Distribution. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
