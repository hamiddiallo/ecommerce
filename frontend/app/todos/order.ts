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

  if (userError) {
    console.error("🚨 Erreur récupération utilisateur :", userError)
    return { error: "Erreur lors de la récupération de l'utilisateur" }
  }

  if (!user) {
    console.warn("⚠️ Aucun utilisateur connecté")
    return { error: "Non autorisé" }
  }

  // 🔍 Étape 2 : récupération du panier
  const { data: cartItems, error: cartError } = await supabase
    .from("cart")
    .select("*, products(*)")
    .eq("user_id", user.id)

  if (cartError) {
    console.error("🚨 Erreur chargement panier :", cartError)
    return { error: "Erreur lors du chargement du panier" }
  }

  if (!cartItems || cartItems.length === 0) {
    console.warn("⚠️ Panier vide pour user", user.id)
    return { error: "Votre panier est vide" }
  }

  console.log("🧺 Contenu du panier :", cartItems)

  // 🔍 Étape 3 : calcul du total
  const total = cartItems.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0
  )

  console.log("💰 Total calculé :", total)

  // 🔍 Étape 4 : création de la commande
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total,
      status: "pending",
      full_name: data.fullName,
      phone: data.phone,
      shipping_address: data.shippingAddress,
    //   city: data.city, // <-- Ajout de la ville si elle existe dans la table
    })
    .select()
    .single()

  if (orderError) {
    console.error("🚨 Erreur création commande :", orderError)
    return { error: "Erreur lors de la création de la commande" }
  }

  if (!order) {
    console.error("🚨 Aucune commande retournée après insertion !")
    return { error: "Commande non créée (aucun retour Supabase)" }
  }

  console.log("🧾 Commande créée :", order)

  // 🔍 Étape 5 : création des items de commande
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.products.name,
    quantity: item.quantity,
    unit_price: item.products.price,
    total_price: item.products.price * item.quantity,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    console.error("🚨 Erreur lors de la création des order_items :", itemsError)
    await supabase.from("orders").delete().eq("id", order.id)
    return { error: "Erreur lors de la création des articles de commande" }
  }

  console.log("📦 Articles de commande insérés :", orderItems.length)

  // 🔍 Étape 6 : vider le panier
  const { error: clearCartError } = await supabase
    .from("cart")
    .delete()
    .eq("user_id", user.id)

  if (clearCartError) {
    console.warn("⚠️ Impossible de vider le panier :", clearCartError)
  }

  // Rafraîchit les pages
  revalidatePath("/cart")
  revalidatePath("/orders")

  return { success: true, orderId: order.id }
}
