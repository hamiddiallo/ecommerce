"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"

const API_URL = "http://localhost:5000/api"

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

  // Check if user is in admin_users table
  const { data: adminUser, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .single()

  if (error || !adminUser) {
    // User is not an admin, redirect to home
    redirect("/?error=unauthorized")
  }

  return user
}


export async function updateOrderStatus(orderId: string, status: string) {
  await checkAdminAccess()

  try {
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) {
      throw new Error("Erreur lors de la mise à jour du statut")
    }

    revalidatePath("/admin/orders")
    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
  } catch (error) {
    return { error: "Erreur lors de la mise à jour du statut" }
  }
}

export async function createProduct(formData: FormData) {
  await checkAdminAccess()

  const productData = {
    category_id: formData.get("category_id"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: Number.parseFloat(formData.get("price") as string),
    unit: formData.get("unit"),
    stock: Number.parseInt(formData.get("stock") as string),
    image_url: formData.get("image_url"),
  }

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })

    if (!res.ok) {
      throw new Error("Erreur lors de la création")
    }

    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    return { error: "Erreur lors de la création du produit" }
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  await checkAdminAccess()

  const productData = {
    category_id: formData.get("category_id"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: Number.parseFloat(formData.get("price") as string),
    unit: formData.get("unit"),
    stock: Number.parseInt(formData.get("stock") as string),
    image_url: formData.get("image_url"),
  }

  try {
    const res = await fetch(`${API_URL}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })

    if (!res.ok) {
      throw new Error("Erreur lors de la mise à jour")
    }

    revalidatePath("/admin/products")
    revalidatePath(`/admin/products/${productId}`)
    return { success: true }
  } catch (error) {
    return { error: "Erreur lors de la mise à jour du produit" }
  }
}

export async function deleteProduct(productId: string) {
  await checkAdminAccess()

  try {
    const res = await fetch(`${API_URL}/products/${productId}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      throw new Error("Erreur lors de la suppression")
    }

    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    return { error: "Erreur lors de la suppression du produit" }
  }
}
