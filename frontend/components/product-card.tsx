"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { cn } from "@/lib/utils"

import { normalizeImageUrl } from "@/lib/image-url"

interface ProductCardProps {
  id: string
  name: string
  price: number
  unit: string
  image_url: string
  images?: string[]
  stock: number
}

export function ProductCard({ id, name, price, unit, image_url, images, stock }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Use images array if available and has items, otherwise fallback to image_url wrapped in array
  const productImages = images && images.length > 0 ? images.map(normalizeImageUrl) : [normalizeImageUrl(image_url)]

  useEffect(() => {
    // Only auto-scroll if there are multiple images and not currently hovered (optional: or always)
    // User requested auto-scroll, usually this means constantly or on hover. 
    // "defilement automatique des images s'ils sont plusieurs et si on est a la page /"
    // Let's make it always scroll slowly, or maybe only when NOT hovered to attract attention?
    // Or maybe ONLY when hovered? "defilement automatique" usually implies always.
    // Let's do a slow auto-scroll always.

    if (productImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [productImages.length])

  const formattedPrice = new Intl.NumberFormat("fr-GN", {
    style: "currency",
    currency: "GNF",
    minimumFractionDigits: 0,
  }).format(price)

  return (
    <Card
      className="group overflow-hidden transition-shadow hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={productImages[currentImageIndex]}
            alt={name}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              isHovered ? "scale-105" : "scale-100"
            )}
          />

          {/* Carousel Indicators */}
          {productImages.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {productImages.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    index === currentImageIndex ? "bg-primary" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${id}`}>
          <h3 className="line-clamp-2 font-medium text-foreground group-hover:text-primary">{name}</h3>
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">{formattedPrice}</span>
          <span className="text-sm text-muted-foreground">/ {unit}</span>
        </div>
        {stock <= 10 && stock > 0 && <p className="mt-1 text-xs text-orange-600">Plus que {stock} en stock</p>}
        {stock === 0 && <p className="mt-1 text-xs text-destructive">Rupture de stock</p>}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <AddToCartButton productId={id} productName={name} stock={stock} className="w-full" />
      </CardFooter>
    </Card>
  )
}
