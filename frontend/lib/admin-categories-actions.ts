"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// Server actions always run on the server, so we need absolute URL
const API_URL = 'http://localhost:5000/api'

/**
 * Get auth token from server-side Supabase session
 */
async function getAuthToken() {
    const supabase = await createServerSupabaseClient()
    if (!supabase) return null

    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || null
}

export async function createCategory(formData: FormData) {
    try {
        const name = formData.get("name") as string
        const slug = formData.get("slug") as string
        const description = formData.get("description") as string

        if (!name || !slug) {
            return { error: "Le nom et le slug sont requis" }
        }

        const token = await getAuthToken()
        if (!token) {
            return { error: "Non authentifié" }
        }

        const res = await fetch(`${API_URL}/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ name, slug, description }),
        })

        if (!res.ok) {
            const text = await res.text()
            try {
                const error = JSON.parse(text)
                return { error: error.error || "Échec de la création de la catégorie" }
            } catch {
                return { error: `Erreur serveur: ${res.status}` }
            }
        }

        revalidatePath("/admin/categories")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Create category error:", error)
        return { error: "Une erreur est survenue" }
    }
}

export async function updateCategory(id: string, formData: FormData) {
    try {
        const name = formData.get("name") as string
        const slug = formData.get("slug") as string
        const description = formData.get("description") as string

        if (!name || !slug) {
            return { error: "Le nom et le slug sont requis" }
        }

        const token = await getAuthToken()
        if (!token) {
            return { error: "Non authentifié" }
        }

        const res = await fetch(`${API_URL}/categories/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ name, slug, description }),
        })

        if (!res.ok) {
            const text = await res.text()
            try {
                const error = JSON.parse(text)
                return { error: error.error || "Échec de la modification de la catégorie" }
            } catch {
                return { error: `Erreur serveur: ${res.status}` }
            }
        }

        revalidatePath("/admin/categories")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Update category error:", error)
        return { error: "Une erreur est survenue" }
    }
}

export async function deleteCategory(id: string) {
    try {
        const token = await getAuthToken()
        if (!token) {
            return { error: "Non authentifié" }
        }

        const res = await fetch(`${API_URL}/categories/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })

        if (!res.ok) {
            const text = await res.text()
            try {
                const error = JSON.parse(text)
                return { error: error.error || "Échec de la suppression de la catégorie" }
            } catch {
                return { error: `Erreur serveur: ${res.status}` }
            }
        }

        revalidatePath("/admin/categories")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Delete category error:", error)
        return { error: "Une erreur est survenue" }
    }
}
