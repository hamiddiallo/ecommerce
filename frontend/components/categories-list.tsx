"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2 } from "lucide-react"
import { deleteCategory } from "@/lib/admin-categories-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CategoryForm } from "@/components/category-form"

interface Category {
    id: string
    name: string
    slug: string
    description?: string
}

interface CategoriesListProps {
    categories: Category[]
}

export function CategoriesList({ categories }: CategoriesListProps) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const router = useRouter()

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        const result = await deleteCategory(id)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Catégorie supprimée")
            router.refresh()
        }

        setDeletingId(null)
    }

    if (categories.length === 0) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    Aucune catégorie. Créez-en une pour commencer.
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {categories.map((category) => (
                <Card key={category.id}>
                    {editingId === category.id ? (
                        <div className="p-4">
                            <CategoryForm
                                category={category}
                                onSuccess={() => setEditingId(null)}
                            />
                            <Button
                                variant="outline"
                                className="mt-4 w-full"
                                onClick={() => setEditingId(null)}
                            >
                                Annuler
                            </Button>
                        </div>
                    ) : (
                        <>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle>{category.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Slug: {category.slug}
                                        </p>
                                        {category.description && (
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setEditingId(category.id)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    disabled={deletingId === category.id}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Êtes-vous sûr de vouloir supprimer la catégorie "{category.name}" ?
                                                        Cette action ne peut pas être annulée.
                                                        {" "}Les produits de cette catégorie doivent être réassignés ou supprimés d'abord.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(category.id)}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Supprimer
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardHeader>
                        </>
                    )}
                </Card>
            ))}
        </div>
    )
}
