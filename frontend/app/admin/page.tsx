"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingBag, TrendingUp, Users } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { AdminCriticalStock } from "@/components/admin-critical-stock"

interface Order {
  id: string
  total: number
  status: string
  full_name: string
  created_at: string
}

interface TopProduct {
  product_name: string
  total_quantity: number
}

export default function AdminDashboard() {
  const supabase = createClient()
  if (!supabase) throw new Error("Supabase n'est pas configuré")

  const [productsCount, setProductsCount] = useState<number>(0)
  const [ordersCount, setOrdersCount] = useState<number>(0)
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0)
  const [totalRevenue, setTotalRevenue] = useState<number>(0)
  const [avgOrder, setAvgOrder] = useState<number>(0)
  const [orders, setOrders] = useState<Order[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [weeklySales, setWeeklySales] = useState<{ date: string; total: number }[]>([])

  useEffect(() => {
    fetchDashboard()
  }, [])

  async function fetchDashboard() {
    const API_URL = "http://localhost:5000/api";

    // 1️⃣ Totals
    const statsRes = await fetch(`${API_URL}/admin/stats`);
    const stats = statsRes.ok ? await statsRes.json() : { productsCount: 0, ordersCount: 0, pendingOrdersCount: 0 };

    setProductsCount(stats.productsCount);
    setOrdersCount(stats.ordersCount);
    setPendingOrdersCount(stats.pendingOrdersCount);

    // 2️⃣ Orders & revenue - Note: we need all orders for calculations
    // For now, we'll fetch from backend. Ideally, backend should provide this aggregated.
    // But since admin page is client-side and we already have getOrders endpoint,
    // we need to make it accessible without userId (for admin). 
    // Actually, we need a different endpoint for admin to get ALL orders.
    // Let me add that to the backend.

    // For now, let's use Supabase client for admin-specific queries
    // since admin dashboard is client-side and needs special permissions.
    // Actually, the admin page uses createClient which is browser client.
    // We should create backend endpoints for admin, but that requires auth.
    // For simplicity, let's keep admin using Supabase client for now,
    // but update the cart/orders user-facing pages.

    const { data: ordersData } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    const ordersList: Order[] = ordersData || [];
    setOrders(ordersList);

    const revenue = ordersList.reduce((sum: number, o: Order) => sum + Number(o.total), 0);
    setTotalRevenue(revenue);
    setAvgOrder(ordersList.length > 0 ? revenue / ordersList.length : 0);

    // 3️⃣ Top 5 produits vendus
    const itemsRes = await fetch(`${API_URL}/admin/order-items`);
    const topProductsData = itemsRes.ok ? await itemsRes.json() : [];

    const productMap: Record<string, number> = {};
    topProductsData?.forEach((item: { product_name: string; quantity: number }) => {
      productMap[item.product_name] = (productMap[item.product_name] || 0) + Number(item.quantity);
    });
    const top5: TopProduct[] = Object.entries(productMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, total_quantity]) => ({ product_name: name, total_quantity }));
    setTopProducts(top5);

    // 4️⃣ Ventes des 7 derniers jours
    const last7 = new Date();
    last7.setDate(last7.getDate() - 7);

    const weeklyMap: Record<string, number> = {};
    ordersList.forEach((order: Order) => {
      const d = new Date(order.created_at);
      if (d >= last7) {
        const key = d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
        weeklyMap[key] = 0;
      }
    });

    const { data: itemsData } = await supabase
      .from("order_items")
      .select("order_id, quantity")
      .in("order_id", ordersList.filter((o) => new Date(o.created_at) >= last7).map((o) => o.id));

    itemsData?.forEach((item: { order_id: string; quantity: number }) => {
      const order = ordersList.find((o) => o.id === item.order_id);
      if (order) {
        const key = new Date(order.created_at).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
        weeklyMap[key] = (weeklyMap[key] || 0) + Number(item.quantity);
      }
    });

    const weeklyArray = Object.entries(weeklyMap)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, total]) => ({ date, total }));
    setWeeklySales(weeklyArray);
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("fr-GN", { style: "currency", currency: "GNF", minimumFractionDigits: 0 }).format(val)

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <AdminNav />
      <main className="flex-1 container mx-auto py-8">
        <h1 className="mb-8 text-3xl font-bold">Tableau de bord</h1>

        {/* KPI CARDS */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productsCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ordersCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Commandes en attente</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrdersCount}</div>
              <p className="text-xs text-muted-foreground">
                {ordersCount > 0 ? ((pendingOrdersCount / ordersCount) * 100).toFixed(0) : 0}% du total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d’affaires total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Panier moyen : {formatCurrency(avgOrder)}</p>
            </CardContent>
          </Card>
        </div>

        {/* GRAPHIQUE & TOP PRODUITS & STOCK CRITIQUE */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ventes des 7 derniers jours</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <AdminCriticalStock />

            <Card>
              <CardHeader>
                <CardTitle>Top 5 produits vendus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {topProducts.map((p, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {["🟣", "🔵", "🟢", "🟡", "🟠"][i]} {p.product_name}
                    </span>
                    <span className="font-semibold">{p.total_quantity}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Commandes récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orders.slice(0, 5).map((order: Order) => {
              const formattedTotal = formatCurrency(Number(order.total))
              const formattedDate = new Date(order.created_at).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">#{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">{order.full_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formattedTotal}</p>
                    <p className="text-sm text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
