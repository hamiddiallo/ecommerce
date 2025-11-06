import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { CategoryNav } from "@/components/category-nav";
import { Footer } from "@/components/footer";
import { CheckoutForm } from "@/components/checkout-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function CheckoutPage() {
  // Création du client Supabase
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase client not configured");
  }

  // Récupérer l'utilisateur connecté
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/checkout");
  }

  // Récupérer les éléments du panier
  const { data: cartItems } = await supabase
    .from("cart")
    .select("*, products(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!cartItems || cartItems.length === 0) {
    redirect("/cart");
  }

  // Calculer le total
  const total = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0);

  const formattedTotal = new Intl.NumberFormat("fr-GN", {
    style: "currency",
    currency: "GNF",
    minimumFractionDigits: 0,
  }).format(total);

  // Récupérer le profil utilisateur
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CategoryNav />

      <main className="flex-1">
        <div className="container py-8">
          <h1 className="mb-8 text-3xl font-bold">Finaliser la commande</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de livraison</CardTitle>
                </CardHeader>
                <CardContent>
                  <CheckoutForm profile={profile} />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Résumé de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={item.products.image_url || "/placeholder.svg"}
                            alt={item.products.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.products.name}</p>
                          <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                          <p className="text-sm font-semibold">
                            {new Intl.NumberFormat("fr-GN", {
                              style: "currency",
                              currency: "GNF",
                              minimumFractionDigits: 0,
                            }).format(item.products.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span className="font-medium">{formattedTotal}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="font-medium">À déterminer</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary">{formattedTotal}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
