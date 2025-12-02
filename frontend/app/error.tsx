"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCcw } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-8 rounded-full bg-destructive/10 p-8 text-destructive">
                <AlertTriangle className="h-12 w-12" />
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Une erreur est survenue</h2>
            <p className="mb-8 max-w-md text-muted-foreground">
                Nous sommes désolés, mais quelque chose s'est mal passé. Veuillez réessayer.
            </p>
            <Button onClick={reset} size="lg">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Réessayer
            </Button>
        </div>
    )
}
