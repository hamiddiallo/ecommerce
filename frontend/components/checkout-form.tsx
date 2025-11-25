"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createOrder } from "@/app/todos/order"

import { toast } from "sonner"

interface CheckoutFormProps {
  profile: {
    full_name: string | null
    phone: string | null
    shipping_address: string | null
    city: string | null
  } | null
}

export function CheckoutForm({ profile }: CheckoutFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    phone: profile?.phone || "",
    shippingAddress: profile?.shipping_address || "",
    city: profile?.city || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await createOrder(formData)

    if (result.error) {
      toast.error("Erreur", {
        description: result.error,
      })
      setIsLoading(false)
    } else {
      toast.success("Commande créée", {
        description: "Votre commande a été créée avec succès",
      })
      router.push(`/orders/${result.orderId}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nom complet *</Label>
        <Input
          id="fullName"
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="Votre nom complet"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone *</Label>
        <Input
          id="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+224 XXX XXX XXX"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">Ville *</Label>
        <Input
          id="city"
          required
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          placeholder="Conakry, Kindia, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shippingAddress">Adresse de livraison *</Label>
        <Textarea
          id="shippingAddress"
          required
          value={formData.shippingAddress}
          onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
          placeholder="Adresse complète de livraison"
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? "Création de la commande..." : "Confirmer la commande"}
      </Button>
    </form>
  )
}
