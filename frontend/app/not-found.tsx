import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-8 rounded-full bg-muted p-8">
                <span className="text-6xl">🔍</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Page introuvable</h1>
            <p className="mb-8 max-w-md text-lg text-muted-foreground">
                Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Accueil
                    </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                    <Link href="/category/cosmetiques">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour aux produits
                    </Link>
                </Button>
            </div>
        </div>
    )
}
