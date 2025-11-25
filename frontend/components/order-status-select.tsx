"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateOrderStatus } from "@/lib/admin-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: string
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)

    const result = await updateOrderStatus(orderId, newStatus)

    if (result.error) {
      toast.error("Erreur", { description: result.error })
    } else {
      toast.success("Statut mis à jour")
      router.refresh()
    }

    setIsUpdating(false)
  }

  const statusLabels: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmée",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  }

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange} disabled={isUpdating}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">{statusLabels.pending}</SelectItem>
        <SelectItem value="confirmed">{statusLabels.confirmed}</SelectItem>
        <SelectItem value="shipped">{statusLabels.shipped}</SelectItem>
        <SelectItem value="delivered">{statusLabels.delivered}</SelectItem>
        <SelectItem value="cancelled">{statusLabels.cancelled}</SelectItem>
      </SelectContent>
    </Select>
  )
}
