"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { addToCart } from "@/lib/cart-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AddToCartButtonProps {
  productId: string
  productName: string
  stock: number
  className?: string
}

export function AddToCartButton({ productId, productName, stock, className }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    setIsLoading(true)

    const result = await addToCart(productId, 1)

    if (result.error) {
      if (result.error.includes("connecté")) {
        toast.error("Connexion requise", {
          description: "Vous devez être connecté pour ajouter des produits au panier",
          action: {
            label: "Se connecter",
            onClick: () => router.push("/auth/login"),
          },
        })
      } else {
        toast.error("Erreur", {
          description: result.error,
        })
      }
    } else {
      toast.success("Produit ajouté", {
        description: `${productName} a été ajouté à votre panier`,
        action: {
          label: "Voir le panier",
          onClick: () => router.push("/cart"),
        },
      })
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <Button onClick={handleAddToCart} disabled={stock === 0 || isLoading} className={className}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isLoading ? "Ajout..." : "Ajouter au panier"}
    </Button>
  )
}
