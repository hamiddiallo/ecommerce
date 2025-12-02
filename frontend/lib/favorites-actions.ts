"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const API_URL = process.env.NEXT_PUBLIC_API_URL?.startsWith('http')
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:5000/api'

/**
 * Get auth token from server-side Supabase session
 */
async function getServerAuthToken(): Promise<string | null> {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Ignore cookie setting errors in server actions
                    }
                },
            },
        }
    )

    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || null
}

export async function toggleFavorite(userId: string, productId: string, isFavorite: boolean) {
    try {
        const token = await getServerAuthToken()
        if (!token) {
            return { error: "Non authentifié" }
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        if (isFavorite) {
            // Remove from favorites
            const res = await fetch(`${API_URL}/favorites?userId=${userId}&productId=${productId}`, {
                method: "DELETE",
                headers,
            })

            if (!res.ok) {
                const error = await res.json()
                return { error: error.error || "Erreur lors de la suppression du favori" }
            }
        } else {
            // Add to favorites
            const res = await fetch(`${API_URL}/favorites`, {
                method: "POST",
                headers,
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
        const token = await getServerAuthToken()
        if (!token) {
            return []
        }

        const res = await fetch(`${API_URL}/favorites?userId=${userId}`, {
            cache: "no-store",
            headers: {
                'Authorization': `Bearer ${token}`
            }
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
        const token = await getServerAuthToken()
        if (!token) {
            return false
        }

        const res = await fetch(`${API_URL}/favorites/check?userId=${userId}&productId=${productId}`, {
            cache: "no-store",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (!res.ok) {
            // Log error but don't throw to avoid breaking UI
            console.error(`Failed to check favorite for product ${productId}: ${res.status}`)
            return false
        }

        const data = await res.json()
        return data.isFavorite
    } catch (error) {
        console.error("Check favorite error:", error)
        return false
    }
}
