"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface CheckoutData {
  fullName: string
  phone: string
  shippingAddress: string
  city: string
}

export async function createOrder(data: CheckoutData) {
  const supabase = await createServerSupabaseClient()
  if (!supabase) throw new Error("❌ Supabase client not configured")

  // 🔍 Étape 1 : récupération de l'utilisateur
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("🚨 Erreur récupération utilisateur ou non connecté")
    return { error: "Non autorisé" }
  }

  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  if (!token) {
    console.error("🚨 Token d'authentification manquant")
    return { error: "Non authentifié" }
  }

  // 🔍 Étape 2 : Appel au backend pour créer la commande
  try {
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: user.id,
        checkoutData: data,
      }),
    })

    const result = await res.json()

    if (!res.ok) {
      console.error("🚨 Erreur backend :", result.error)
      return { error: result.error || "Erreur lors de la création de la commande" }
    }

    // Rafraîchit les pages
    revalidatePath("/cart")
    revalidatePath("/orders")

    return { success: true, orderId: result.orderId }
  } catch (error) {
    console.error("🚨 Erreur connexion backend :", error)
    return { error: "Impossible de contacter le serveur" }
  }
}
