import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface CheckoutData {
  fullName: string;
  phone: string;
  shippingAddress: string;
  city: string;
}

export async function createOrder(data: CheckoutData) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase client not configured"); // ✅ vérification

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Non autorisé" };
  }

  // Get cart items
  const { data: cartItems, error: cartError } = await supabase
    .from("cart")
    .select("*, products(*)")
    .eq("user_id", user.id);

  if (cartError || !cartItems || cartItems.length === 0) {
    return { error: "Votre panier est vide" };
  }

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0);

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total,
      status: "pending",
      full_name: data.fullName,
      phone: data.phone,
      shipping_address: data.shippingAddress,
    })
    .select()
    .single();

  if (orderError || !order) {
    return { error: "Erreur lors de la création de la commande" };
  }

  // Create order items
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.products.name,
    quantity: item.quantity,
    unit_price: item.products.price,
    total_price: item.products.price * item.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    // Rollback order if items creation fails
    await supabase.from("orders").delete().eq("id", order.id);
    return { error: "Erreur lors de la création des articles de commande" };
  }

  // Clear cart
  await supabase.from("cart").delete().eq("user_id", user.id);

  revalidatePath("/cart");
  revalidatePath("/orders");

  return { success: true, orderId: order.id };
}

export async function getOrders() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase client not configured"); // ✅ vérification

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name, image_url))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return orders || [];
}
