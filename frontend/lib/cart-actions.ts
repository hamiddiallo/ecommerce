"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const API_URL = "http://localhost:5000/api"

/**
 * Get auth token from server-side Supabase session
 */
async function getAuthToken() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) return null

  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
}

export async function addToCart(productId: string, quantity = 1) {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Vous devez être connecté pour ajouter des produits au panier" }
  }

  try {
    const token = await getAuthToken()
    if (!token) {
      return { error: "Non authentifié" }
    }

    const res = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ userId: user.id, productId, quantity }),
    })

    if (!res.ok) {
      const error = await res.json()
      return { error: error.error || "Erreur lors de l'ajout au panier" }
    }

    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    return { error: "Erreur de connexion au serveur" }
  }
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non autorisé" }
  }

  try {
    const token = await getAuthToken()
    if (!token) {
      return { error: "Non authentifié" }
    }

    const res = await fetch(`${API_URL}/cart/${cartItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ userId: user.id, quantity }),
    })

    if (!res.ok) {
      return { error: "Erreur lors de la mise à jour" }
    }

    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    return { error: "Erreur de connexion" }
  }
}

export async function removeFromCart(cartItemId: string) {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non autorisé" }
  }

  try {
    const token = await getAuthToken()
    if (!token) {
      return { error: "Non authentifié" }
    }

    const res = await fetch(`${API_URL}/cart/${cartItemId}?userId=${user.id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    if (!res.ok) {
      return { error: "Erreur lors de la suppression" }
    }

    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    return { error: "Erreur de connexion" }
  }
}

export async function getCartCount() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) return 0

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return 0

  try {
    const token = await getAuthToken()
    if (!token) return 0

    const res = await fetch(`${API_URL}/cart?userId=${user.id}`, {
      cache: 'no-store',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    if (!res.ok) return 0

    const cartItems = await res.json()
    // Return the number of unique items (rows) instead of total quantity
    return cartItems.length
  } catch (error) {
    return 0
  }
}
