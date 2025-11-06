"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2 } from "lucide-react"
import { updateCartQuantity, removeFromCart } from "@/lib/cart-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
    router.refresh()
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
    router.refresh()
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Link href={`/product/${product.id}`} className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
            <Image src={product.image_url || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </Link>

          <div className="flex flex-1 flex-col justify-between">
            <div>
              <Link href={`/product/${product.id}`} className="font-medium hover:text-primary">
                {product.name}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {formattedPrice} / {product.unit}
              </p>
            </div>

            <div className="flex items-center justify-between">
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
                  value={quantity}
                  onChange={(e) => handleUpdateQuantity(Number.parseInt(e.target.value) || 1)}
                  className="h-8 w-16 text-center"
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

              <div className="flex items-center gap-4">
                <span className="font-semibold">{formattedTotal}</span>
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
