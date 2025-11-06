"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

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

  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single()

  if (existingItem) {
    // Update quantity
    const { error } = await supabase
      .from("cart")
      .update({ quantity: existingItem.quantity + quantity, updated_at: new Date().toISOString() })
      .eq("id", existingItem.id)

    if (error) {
      return { error: "Erreur lors de la mise à jour du panier" }
    }
  } else {
    // Insert new item
    const { error } = await supabase.from("cart").insert({
      user_id: user.id,
      product_id: productId,
      quantity,
    })

    if (error) {
      return { error: "Erreur lors de l'ajout au panier" }
    }
  }

  revalidatePath("/cart")
  return { success: true }
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

  if (quantity <= 0) {
    return removeFromCart(cartItemId)
  }

  const { error } = await supabase
    .from("cart")
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq("id", cartItemId)
    .eq("user_id", user.id)

  if (error) {
    return { error: "Erreur lors de la mise à jour" }
  }

  revalidatePath("/cart")
  return { success: true }
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

  const { error } = await supabase.from("cart").delete().eq("id", cartItemId).eq("user_id", user.id)

  if (error) {
    return { error: "Erreur lors de la suppression" }
  }

  revalidatePath("/cart")
  return { success: true }
}

export async function getCartCount() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré")
  }
  if (!supabase) {
    return 0
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return 0
  }

  const { data, error } = await supabase.from("cart").select("quantity").eq("user_id", user.id)

  if (error || !data) {
    return 0
  }

  return data.reduce((total, item) => total + item.quantity, 0)
}
