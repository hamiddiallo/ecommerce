"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cancelOrder } from "@/lib/order-actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface CancelOrderButtonProps {
    orderId: string
    status: string
}

export default function CancelOrderButton({ orderId, status }: CancelOrderButtonProps) {
    const [isPending, setIsPending] = useState(false)

    // On ne peut annuler que si la commande est en attente ou confirmée
    // Si elle est déjà expédiée, livrée ou annulée, on ne montre pas le bouton
    if (["shipped", "delivered", "cancelled"].includes(status)) {
        return null
    }

    async function handleCancel() {
        setIsPending(true)
        const res = await cancelOrder(orderId)
        setIsPending(false)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Commande annulée avec succès")
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Annuler la commande
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Votre commande sera annulée et ne sera pas traitée.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Retour</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Confirmer l'annulation
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
