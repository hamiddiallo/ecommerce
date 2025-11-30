"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleFavorite, checkFavorite } from "@/lib/favorites-actions"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface FavoriteButtonProps {
    productId: string
    initialIsFavorite?: boolean
}

export function FavoriteButton({ productId, initialIsFavorite = false }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [isLoading, setIsLoading] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const initFavorite = async () => {
            const supabase = createClient()
            if (!supabase) {
                setIsChecking(false)
                return
            }

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setIsChecking(false)
                return
            }

            setUserId(user.id)

            // Check if product is already favorited
            const favoriteStatus = await checkFavorite(user.id, productId)
            setIsFavorite(favoriteStatus)
            setIsChecking(false)
        }

        initFavorite()
    }, [productId])

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation if button is inside a link
        e.stopPropagation()

        if (!userId) {
            toast.error("Vous devez être connecté pour ajouter des favoris")
            return
        }

        setIsLoading(true)
        const result = await toggleFavorite(userId, productId, isFavorite)

        if (result.error) {
            toast.error(result.error)
        } else {
            setIsFavorite(!isFavorite)
            toast.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris")
        }

        setIsLoading(false)
    }

    // Don't show button if user is not logged in or still checking
    if (!userId || isChecking) return null

    return (
        <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm"
            onClick={handleToggle}
            disabled={isLoading}
        >
            <Heart
                className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
        </Button>
    )
}
