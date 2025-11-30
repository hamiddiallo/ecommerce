"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createCategory, updateCategory } from "@/lib/admin-categories-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface CategoryFormProps {
    category?: {
        id: string
        name: string
        slug: string
        description?: string
    }
    onSuccess?: () => void
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const isEditing = !!category

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const form = e.currentTarget
        const formData = new FormData(form)
        const result = isEditing
            ? await updateCategory(category.id, formData)
            : await createCategory(formData)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(isEditing ? "Catégorie modifiée" : "Catégorie créée")
            router.refresh()
            if (!isEditing) {
                form.reset()
            }
            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess()
            }
        }

        setIsSubmitting(false)
    }

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isEditing) {
            const slug = e.target.value
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Remove accents
                .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with -
                .replace(/^-+|-+$/g, "") // Remove leading/trailing -

            const slugInput = e.currentTarget.form?.querySelector('input[name="slug"]') as HTMLInputElement
            if (slugInput) slugInput.value = slug
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEditing ? "Modifier la catégorie" : "Nouvelle catégorie"}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom *</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={category?.name}
                            onChange={handleNameChange}
                            required
                            placeholder="Ex: Cosmétiques"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug *</Label>
                        <Input
                            id="slug"
                            name="slug"
                            defaultValue={category?.slug}
                            required
                            placeholder="Ex: cosmetiques"
                            pattern="[a-z0-9-]+"
                            title="Lettres minuscules, chiffres et tirets uniquement"
                        />
                        <p className="text-xs text-muted-foreground">
                            URL-friendly (lettres minuscules, chiffres, tirets)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={category?.description}
                            placeholder="Description de la catégorie"
                            rows={3}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "En cours..." : isEditing ? "Modifier" : "Créer"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
