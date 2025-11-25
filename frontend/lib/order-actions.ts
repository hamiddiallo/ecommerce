import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const API_URL = "http://localhost:5000/api";

interface CheckoutData {
  fullName: string;
  phone: string;
  shippingAddress: string;
  city: string;
}

export async function createOrder(data: CheckoutData) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase client not configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Non autorisé" };
  }

  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, checkoutData: data }),
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.error || "Erreur lors de la création de la commande" };
    }

    const result = await res.json();

    revalidatePath("/cart");
    revalidatePath("/orders");

    return { success: true, orderId: result.orderId };
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
}

export async function getOrders() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase client not configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  try {
    const res = await fetch(`${API_URL}/orders?userId=${user.id}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}
