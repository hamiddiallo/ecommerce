"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2 } from "lucide-react"
import { updateCartQuantity, removeFromCart } from "@/lib/cart-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { normalizeImageUrl } from "@/lib/image-url"

interface CartItemProps {
  id: string
  product: {
    id: string
    name: string
    price: number
    unit: string
    image_url: string
    stock: number
  }
  quantity: number
}

export function CartItem({ id, product, quantity }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  // Sync local state when prop changes
  useEffect(() => {
    setLocalQuantity(quantity)
  }, [quantity])

  const formattedPrice = new Intl.NumberFormat("fr-GN", {
    style: "currency",
    currency: "GNF",
    minimumFractionDigits: 0,
  }).format(product.price)

  const formattedTotal = new Intl.NumberFormat("fr-GN", {
    style: "currency",
    currency: "GNF",
    minimumFractionDigits: 0,
  }).format(product.price * quantity)

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > product.stock) return

    setIsUpdating(true)
    const result = await updateCartQuantity(id, newQuantity)

    if (result.error) {
      toast.error("Erreur", { description: result.error })
    }

    setIsUpdating(false)
  }

  const handleRemove = async () => {
    setIsUpdating(true)
    const result = await removeFromCart(id)

    if (result.error) {
      toast.error("Erreur", { description: result.error })
    } else {
      toast.success("Produit retiré du panier")
    }

    setIsUpdating(false)
  }

  const [localQuantity, setLocalQuantity] = useState(quantity)

  // Sync local state when prop changes (e.g. after successful update)
  if (quantity !== localQuantity && !isUpdating) {
    // We only sync if we are NOT currently updating to avoid race conditions/jumping
    // Actually, better to use useEffect for prop sync
  }

  // Let's use useEffect to sync prop to local state
  // import { useEffect } from "react" (need to add import)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === "") {
      setLocalQuantity(0) // Allow clearing the input
      return
    }
    const numVal = parseInt(val)
    if (!isNaN(numVal)) {
      setLocalQuantity(numVal)
    }
  }

  const handleBlur = () => {
    let finalQuantity = localQuantity

    // Validate quantity
    if (finalQuantity < 1) {
      finalQuantity = 1
      setLocalQuantity(1)
    }

    if (finalQuantity > product.stock) {
      toast.warning("Stock insuffisant", {
        description: `Seulement ${product.stock} unité(s) disponible(s). Quantité ajustée.`
      })
      finalQuantity = product.stock
      setLocalQuantity(product.stock)
    }

    if (finalQuantity !== quantity) {
      handleUpdateQuantity(finalQuantity)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    }
  }

  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link href={`/product/${product.id}`} className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-md mx-auto sm:mx-0">
            <Image src={normalizeImageUrl(product.image_url)} alt={product.name} fill className="object-cover" />
          </Link>

          <div className="flex flex-1 flex-col justify-between gap-3">
            <div>
              <Link href={`/product/${product.id}`} className="font-medium hover:text-primary text-sm sm:text-base line-clamp-2">
                {product.name}
              </Link>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                {formattedPrice} / {product.unit}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => handleUpdateQuantity(quantity - 1)}
                  disabled={isUpdating || quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  value={localQuantity}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className="h-8 w-14 sm:w-16 text-center text-sm"
                  min={1}
                  max={product.stock}
                  disabled={isUpdating}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => handleUpdateQuantity(quantity + 1)}
                  disabled={isUpdating || quantity >= product.stock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="font-semibold text-sm sm:text-base">{formattedTotal}</span>
                <Button variant="ghost" size="icon" onClick={handleRemove} disabled={isUpdating}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
