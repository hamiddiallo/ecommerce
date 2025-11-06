"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function checkAdminAccess() {
  const supabase = await createServerSupabaseClient()
    if (!supabase) {
      throw new Error("Supabase n'est pas configuré")
    }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin")
  }

  const { data: isAdmin } = await supabase.from("admin_users").select("id").eq("id", user.id).single()

  if (!isAdmin) {
    redirect("/")
  }

  return user
}

export async function updateOrderStatus(orderId: string, status: string) {
  await checkAdminAccess()
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré")
  }

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)

  if (error) {
    return { error: "Erreur lors de la mise à jour du statut" }
  }

  revalidatePath("/admin/orders")
  revalidatePath(`/admin/orders/${orderId}`)
  return { success: true }
}

export async function createProduct(formData: FormData) {
  await checkAdminAccess()
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré")
  }

  const productData = {
    category_id: formData.get("category_id") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: Number.parseFloat(formData.get("price") as string),
    unit: formData.get("unit") as string,
    stock: Number.parseInt(formData.get("stock") as string),
    image_url: formData.get("image_url") as string,
  }

  const { error } = await supabase.from("products").insert(productData)

  if (error) {
    return { error: "Erreur lors de la création du produit" }
  }

  revalidatePath("/admin/products")
  return { success: true }
}

export async function updateProduct(productId: string, formData: FormData) {
  await checkAdminAccess()
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré")
  }

  const productData = {
    category_id: formData.get("category_id") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: Number.parseFloat(formData.get("price") as string),
    unit: formData.get("unit") as string,
    stock: Number.parseInt(formData.get("stock") as string),
    image_url: formData.get("image_url") as string,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("products").update(productData).eq("id", productId)

  if (error) {
    return { error: "Erreur lors de la mise à jour du produit" }
  }

  revalidatePath("/admin/products")
  revalidatePath(`/admin/products/${productId}`)
  return { success: true }
}

export async function deleteProduct(productId: string) {
  await checkAdminAccess()
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré")
  }

  const { error } = await supabase.from("products").delete().eq("id", productId)

  if (error) {
    return { error: "Erreur lors de la suppression du produit" }
  }

  revalidatePath("/admin/products")
  return { success: true }
}
