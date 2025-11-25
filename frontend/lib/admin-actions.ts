"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const API_URL = "http://localhost:5000/api"

// Temporarily disabled auth check for independent backend transition
export async function checkAdminAccess() {
  return true
  /*
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
  */
}

export async function updateOrderStatus(orderId: string, status: string) {
  // await checkAdminAccess()
  // TODO: Implement orders in backend
  return { success: true }
}

export async function createProduct(formData: FormData) {
  // await checkAdminAccess()

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
  // await checkAdminAccess()

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
  // await checkAdminAccess()

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
