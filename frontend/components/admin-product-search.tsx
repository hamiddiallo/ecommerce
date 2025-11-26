"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface AdminProductSearchProps {
    onSearch: (query: string) => void
}

export function AdminProductSearch({ onSearch }: AdminProductSearchProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const handleChange = (value: string) => {
        setSearchQuery(value)
        onSearch(value)
    }

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Rechercher un produit..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    )
}
