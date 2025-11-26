"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Product {
    id: string
    name: string
    stock: number
    image_url: string
}

export function AdminCriticalStock() {
    const [threshold, setThreshold] = useState(10)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLowStockProducts()
    }, [threshold])

    async function fetchLowStockProducts() {
        setLoading(true)
        const supabase = createClient()

        const { data, error } = await supabase
            .from("products")
            .select("id, name, stock, image_url")
            .lt("stock", threshold)
            .order("stock", { ascending: true })

        if (!error && data) {
            setProducts(data)
        }
        setLoading(false)
    }

    return (
        <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <CardTitle className="text-lg font-medium text-orange-900">
                            Stock Critique
                            {products.length > 0 && (
                                <span className="ml-2 text-sm font-normal text-orange-700">
                                    ({products.length})
                                </span>
                            )}
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="threshold" className="text-sm text-orange-800">Seuil :</Label>
                        <Input
                            id="threshold"
                            type="number"
                            value={threshold}
                            onChange={(e) => setThreshold(Number(e.target.value))}
                            className="h-8 w-20 border-orange-200 bg-white"
                            min={1}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-sm text-orange-800">Chargement...</p>
                ) : products.length > 0 ? (
                    <div className="relative">
                        {/* Scrollable container - max 5 items visible */}
                        <div
                            className="space-y-3 max-h-[340px] overflow-y-auto pr-2"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#fed7aa #ffedd5'
                            }}
                        >
                            {products.map((product) => (
                                <div key={product.id} className="flex items-center justify-between rounded-md border border-orange-100 bg-white p-2 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 overflow-hidden rounded bg-muted flex-shrink-0">
                                            {product.image_url && (
                                                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">Stock: <span className="font-bold text-orange-600">{product.stock}</span></p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild className="h-8 text-orange-700 hover:text-orange-900 hover:bg-orange-100 flex-shrink-0">
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                            Gérer
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Scroll indicator for more items */}
                        {products.length > 5 && (
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-orange-50/90 to-transparent pointer-events-none flex items-end justify-center pb-1">
                                <p className="text-xs text-orange-600 font-medium">
                                    ↓ Faites défiler pour voir plus
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-orange-800">Aucun produit en dessous du seuil.</p>
                )}
            </CardContent>
        </Card>
    )
}
