"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"

export function AdminProductSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

    // Simple debounce implementation inside component if hook doesn't exist
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            const currentQ = params.get("q") || ""

            // Only update if the query actually changed
            if (searchQuery !== currentQ) {
                if (searchQuery) {
                    params.set("q", searchQuery)
                } else {
                    params.delete("q")
                }
                // Reset to page 1 on search
                params.set("page", "1")

                router.push(`?${params.toString()}`)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery, router]) // Removed searchParams from dependencies to prevent loop


    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Rechercher un produit..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    )
}
