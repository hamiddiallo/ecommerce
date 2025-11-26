"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Pencil } from "lucide-react"
import { DeleteProductButton } from "@/components/delete-product-button"
import { AdminProductSearch } from "@/components/admin-product-search"

interface Product {
    id: string
    name: string
    price: number
    unit: string
    stock: number
    image_url: string | null
    categories: { name: string } | null
}

interface AdminProductsListProps {
    products: Product[]
}

export function AdminProductsList({ products }: AdminProductsListProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <>
            <div className="mb-6">
                <AdminProductSearch onSearch={setSearchQuery} />
                {searchQuery && (
                    <p className="mt-2 text-sm text-muted-foreground">
                        {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} trouvé{filteredProducts.length > 1 ? "s" : ""}
                    </p>
                )}
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => {
                        const formattedPrice = new Intl.NumberFormat("fr-GN", {
                            style: "currency",
                            currency: "GNF",
                            minimumFractionDigits: 0,
                        }).format(product.price)

                        return (
                            <Card key={product.id}>
                                <div className="relative aspect-square overflow-hidden bg-muted">
                                    <Image
                                        src={product.image_url || "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <div className="mb-2 flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                                            {product.categories && (
                                                <p className="text-xs text-muted-foreground">{product.categories.name}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-lg font-bold text-primary">{formattedPrice}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Stock: {product.stock} {product.unit}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1" asChild>
                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Modifier
                                            </Link>
                                        </Button>
                                        <DeleteProductButton productId={product.id} productName={product.name} />
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <div className="py-12 text-center">
                    <p className="text-muted-foreground">
                        {searchQuery ? "Aucun produit trouvé" : "Aucun produit disponible"}
                    </p>
                </div>
            )}
        </>
    )
}
