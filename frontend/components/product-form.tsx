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
    images?: string[] // Added for multiple images
  }
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images && product.images.length > 0
      ? product.images
      : product?.image_url
        ? [product.image_url]
        : []
  )

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedImages((prev) => [...prev, ...filesArray])
    }
  }

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    // Remove default image field if present, we handle it manually
    formData.delete("image")

    // 1. Add existing images that weren't removed
    existingImages.forEach((url) => {
      formData.append("images", url)
    })

    // 2. Upload new images
    if (selectedImages.length > 0) {
      for (const file of selectedImages) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", file)

        try {
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          })

          if (!uploadResponse.ok) {
            // Attempt to parse error message from response if available
            const errorData = await uploadResponse.json().catch(() => ({ error: "Unknown error" }));
            toast.error(`Erreur upload ${file.name}`, { description: errorData.error || "Erreur lors de l'upload de l'image" });
            continue; // Skip to the next file
          }

          const uploadResult = await uploadResponse.json()
          // Use relative path for image URL as well, or full URL if needed.
          // Since we are storing the path, let's keep it relative or construct it properly.
          // If the backend returns a relative path like '/uploads/image.jpg', we might need to prepend the API URL or just use it as is if we have a proxy for /uploads.
          // We added a proxy for /uploads in next.config.mjs! So we can just use the path.
          if (uploadResult.error) {
            toast.error(`Erreur upload ${file.name}`, { description: uploadResult.error })
            continue
          }

          // Add uploaded image URL to formData
          formData.append("images", uploadResult.filePath)
        } catch (error) {
          console.error("Upload error:", error)
          toast.error(`Erreur upload ${file.name}`)
        }
      }
    }

    const result = product
      ? await updateProduct(product.id, formData)
      : await createProduct(formData)

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
        <Label htmlFor="images">Images du produit</Label>
        <Input
          id="images"
          name="image"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        {/* Image Previews */}
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {/* Existing Images */}
          {existingImages.map((url, index) => (
            <div key={`existing-${index}`} className="relative aspect-square overflow-hidden rounded-md border bg-muted">
              <img src={url} alt={`Existing ${index}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
              <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1 text-xs text-white">Existante</span>
            </div>
          ))}

          {/* New Selected Images */}
          {selectedImages.map((file, index) => (
            <div key={`new-${index}`} className="relative aspect-square overflow-hidden rounded-md border bg-muted">
              <img src={URL.createObjectURL(file)} alt={`New ${index}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeSelectedImage(index)}
                className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
              <span className="absolute bottom-1 left-1 rounded bg-blue-500/50 px-1 text-xs text-white">Nouvelle</span>
            </div>
          ))}
        </div>
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
