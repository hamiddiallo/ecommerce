import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AddToCartButton } from "@/components/add-to-cart-button"

interface ProductCardProps {
  id: string
  name: string
  price: number
  unit: string
  image_url: string
  stock: number
}

export function ProductCard({ id, name, price, unit, image_url, stock }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("fr-GN", {
    style: "currency",
    currency: "GNF",
    minimumFractionDigits: 0,
  }).format(price)

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/product/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image_url || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
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
