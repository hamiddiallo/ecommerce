import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { CategoryNav } from "@/components/category-nav"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

//
// ✅ Interfaces pour typer les données Supabase
//
interface Product {
  name: string
  image_url: string | null
}

interface OrderItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  products?: Product
}

interface Order {
  id: string
  total: number
  status: string
  created_at: string
  full_name: string
  phone: string
  shipping_address: string
  order_items: OrderItem[]
}

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

//
// ✅ Page de détails de commande
//
export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  if (!supabase) {
    throw new Error("Supabase n'est pas configuré")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  //
  // ✅ Requête typée
  //
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name, image_url))")
    .eq("id", id)
    .eq("user_id", user.id)
    .single<Order>()

  if (!order) {
    notFound()
  }

  //
  // ✅ Badge de statut
  //
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
    }

    const labels: Record<string, string> = {
      pending: "En attente",
      confirmed: "Confirmée",
      shipped: "Expédiée",
      delivered: "Livrée",
      cancelled: "Annulée",
    }

    return <Badge variant={variants[status] || "outline"}>{labels[status] || status}</Badge>
  }

  //
  // ✅ Formatage des données
  //
  const formattedTotal = new Intl.NumberFormat("fr-GN", {
    style: "currency",
    currency: "GNF",
    minimumFractionDigits: 0,
  }).format(order.total)

  const formattedDate = new Date(order.created_at).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  //
  // ✅ Rendu JSX
  //
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CategoryNav />

      <main className="flex-1">
        <div className="container py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux commandes
            </Link>
          </Button>

          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Commande #{order.id.slice(0, 8)}</h1>
              <p className="mt-1 text-muted-foreground">{formattedDate}</p>
            </div>
            {getStatusBadge(order.status)}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* 🧺 Articles commandés */}
            <div className="space-y-4 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Articles commandés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={item.products?.image_url || "/placeholder.svg"}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product_name}</h3>
                        <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                        <p className="mt-1 font-semibold">
                          {new Intl.NumberFormat("fr-GN", {
                            style: "currency",
                            currency: "GNF",
                            minimumFractionDigits: 0,
                          }).format(item.total_price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* 🧾 Résumé + Livraison */}
            <div className="space-y-4 lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Résumé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-medium">{formattedTotal}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-primary">{formattedTotal}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations de livraison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium">{order.full_name}</p>
                    <p className="text-muted-foreground">{order.phone}</p>
                  </div>
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-muted-foreground">{order.shipping_address}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
