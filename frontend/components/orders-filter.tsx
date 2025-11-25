// components/orders-filter.tsx
"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface OrdersFilterProps {
  currentStatus: string
}

const statusFilters = [
  { value: "all", label: "Toutes mes commandes" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmées" },
  { value: "shipped", label: "Expédiées" },
  { value: "delivered", label: "Livrées" },
  { value: "cancelled", label: "Annulées" },
]

export function OrdersFilter({ currentStatus }: OrdersFilterProps) {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)

  useEffect(() => {
    setSelectedStatus(currentStatus)
  }, [currentStatus])

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    if (value === "all") {
      router.push("/orders")
    } else {
      router.push(`/orders?status=${value}`)
    }
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <label htmlFor="status-filter" className="text-sm font-medium whitespace-nowrap">
          Filtrer par statut :
        </label>
        <div className="flex gap-2 items-center flex-1 w-full sm:w-auto">
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex-1"
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Bouton de réinitialisation conditionnel */}
        {currentStatus !== "all" && (
          <button
            onClick={() => handleStatusChange("all")}
            className="text-sm text-muted-foreground hover:text-foreground underline whitespace-nowrap bg-transparent border-none cursor-pointer"
          >
            Voir toutes les commandes
          </button>
        )}
      </div>
    </div>
  )
}