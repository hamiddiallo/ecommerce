"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"

interface Product {
    id: string
    name: string
    price: number
    image_url: string | null
}

export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("")
    const [results, setResults] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const router = useRouter()
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Debounce search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setResults([])
            setShowDropdown(false)
            return
        }

        setIsLoading(true)
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/products?search=${encodeURIComponent(searchQuery)}`
                )
                if (res.ok) {
                    const responseData = await res.json()
                    const products = Array.isArray(responseData) ? responseData : (responseData.data || [])
                    setResults(products.slice(0, 5)) // Show max 5 results
                    setShowDropdown(true)
                }
            } catch (error) {
                console.error("Search error:", error)
            } finally {
                setIsLoading(false)
            }
        }, 300) // 300ms debounce

        return () => clearTimeout(timer)
    }, [searchQuery])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setShowDropdown(false)
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fr-GN", {
            style: "currency",
            currency: "GNF",
            minimumFractionDigits: 0,
        }).format(price)
    }

    return (
        <div ref={dropdownRef} className="relative w-full max-w-md">
            <form onSubmit={handleSubmit}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Rechercher des produits..."
                    className="pl-10 pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                        if (results.length > 0) setShowDropdown(true)
                    }}
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
            </form>

            {/* Dropdown Results */}
            {showDropdown && results.length > 0 && (
                <div className="absolute top-full z-50 mt-2 w-full rounded-md border bg-popover shadow-lg">
                    <div className="p-2">
                        {results.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="flex items-center gap-3 rounded-md p-2 hover:bg-accent"
                                onClick={() => {
                                    setShowDropdown(false)
                                    setSearchQuery("")
                                }}
                            >
                                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-muted">
                                    <Image
                                        src={product.image_url || "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="truncate font-medium text-sm">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {searchQuery && (
                        <div className="border-t p-2">
                            <Link
                                href={`/search?q=${encodeURIComponent(searchQuery)}`}
                                className="block rounded-md p-2 text-center text-sm text-primary hover:bg-accent"
                                onClick={() => {
                                    setShowDropdown(false)
                                }}
                            >
                                Voir tous les résultats pour "{searchQuery}"
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* No results message */}
            {showDropdown && !isLoading && searchQuery && results.length === 0 && (
                <div className="absolute top-full z-50 mt-2 w-full rounded-md border bg-popover p-4 shadow-lg">
                    <p className="text-center text-sm text-muted-foreground">
                        Aucun résultat pour "{searchQuery}"
                    </p>
                </div>
            )}
        </div>
    )
}
