"use server"

import { revalidatePath } from "next/cache"

const API_URL = process.env.NEXT_PUBLIC_API_URL?.startsWith('http')
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:5000/api'

export async function toggleFavorite(userId: string, productId: string, isFavorite: boolean) {
    try {
        if (isFavorite) {
            // Remove from favorites
            const res = await fetch(`${API_URL}/favorites?userId=${userId}&productId=${productId}`, {
                method: "DELETE",
            })

            if (!res.ok) {
                const error = await res.json()
                return { error: error.error || "Erreur lors de la suppression du favori" }
            }
        } else {
            // Add to favorites
            const res = await fetch(`${API_URL}/favorites`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, productId }),
            })

            if (!res.ok) {
                const error = await res.json()
                return { error: error.error || "Erreur lors de l'ajout du favori" }
            }
        }

        revalidatePath("/")
        revalidatePath("/favorites")
        return { success: true }
    } catch (error) {
        console.error("Toggle favorite error:", error)
        return { error: "Une erreur est survenue" }
    }
}

export async function getFavorites(userId: string) {
    try {
        const res = await fetch(`${API_URL}/favorites?userId=${userId}`, {
            cache: "no-store",
        })

        if (!res.ok) {
            throw new Error("Failed to fetch favorites")
        }

        return await res.json()
    } catch (error) {
        console.error("Get favorites error:", error)
        return []
    }
}

export async function checkFavorite(userId: string, productId: string) {
    try {
        const res = await fetch(`${API_URL}/favorites/check?userId=${userId}&productId=${productId}`, {
            cache: "no-store",
        })

        if (!res.ok) {
            throw new Error("Failed to check favorite")
        }

        const data = await res.json()
        return data.isFavorite
    } catch (error) {
        console.error("Check favorite error:", error)
        return false
    }
}
