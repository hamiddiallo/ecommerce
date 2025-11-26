"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateOrderStatus } from "@/lib/admin-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Lock } from "lucide-react"

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: string
  isLocked?: boolean
}

export function OrderStatusSelect({ orderId, currentStatus, isLocked = false }: OrderStatusSelectProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    if (isLocked) {
      toast.error("Commande verrouillée par le client")
      return
    }

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

  if (isLocked) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-muted bg-muted/50 px-3 py-2">
        <Lock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {statusLabels[currentStatus]} (Verrouillée par le client)
        </span>
      </div>
    )
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
