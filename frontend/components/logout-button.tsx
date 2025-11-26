"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  iconOnly?: boolean
}

export function LogoutButton({ iconOnly = false }: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      // Force redirect to home page
      window.location.href = "/"
    } catch (error: unknown) {
      console.error("Erreur lors de la déconnexion:", error)
      setIsLoading(false)
    }
  }

  if (iconOnly) {
    return (
      <Button variant="ghost" size="sm" onClick={handleLogout} disabled={isLoading} className="h-9">
        <LogOut className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Déconnexion..." : "Se déconnecter"}
    </Button>
  )
}
