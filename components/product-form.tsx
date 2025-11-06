"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProduct, updateProduct } from "@/lib/admin-actions"
import { toast } from "sonner"

interface ProductFormProps {
  categories: Array<{ id: string; name: string }>
  product?: {
    id: string
    category_id: string
    name: string
    description: string
    price: number
    unit: string
    stock: number
    image_url: string
  }
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    const result = product ? await updateProduct(product.id, formData) : await createProduct(formData)

    if (result.error) {
      toast.error("Erreur", { description: result.error })
      setIsLoading(false)
    } else {
      toast.success(product ? "Produit mis à jour" : "Produit créé")
      router.push("/admin/products")
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du produit *</Label>
        <Input id="name" name="name" required defaultValue={product?.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_id">Catégorie *</Label>
        <Select name="category_id" required defaultValue={product?.category_id}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} defaultValue={product?.description} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Prix (GNF) *</Label>
          <Input id="price" name="price" type="number" required defaultValue={product?.price} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unité *</Label>
          <Select name="unit" required defaultValue={product?.unit}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une unité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pièce">Pièce</SelectItem>
              <SelectItem value="carton">Carton</SelectItem>
              <SelectItem value="douzaine">Douzaine</SelectItem>
              <SelectItem value="paquet">Paquet</SelectItem>
              <SelectItem value="boite">Boîte</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock">Stock *</Label>
        <Input id="stock" name="stock" type="number" required defaultValue={product?.stock} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">URL de l'image</Label>
        <Input
          id="image_url"
          name="image_url"
          type="url"
          placeholder="/placeholder.svg?height=400&width=400"
          defaultValue={product?.image_url}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Enregistrement..." : product ? "Mettre à jour" : "Créer le produit"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="bg-transparent">
          Annuler
        </Button>
      </div>
    </form>
  )
}
