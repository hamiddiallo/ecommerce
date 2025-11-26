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
import { cancelOrder, unlockOrder } from "@/lib/order-actions"
import { toast } from "sonner"
import { Loader2, Lock, Unlock } from "lucide-react"

interface OrderActionsProps {
    orderId: string
    status: string
    isLocked: boolean
}

export default function OrderActions({ orderId, status, isLocked }: OrderActionsProps) {
    const [isPending, setIsPending] = useState(false)

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

    async function handleUnlock() {
        setIsPending(true)
        const res = await unlockOrder(orderId)
        setIsPending(false)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Commande déverrouillée - l'admin peut maintenant la modifier")
        }
    }

    // Show unlock button if cancelled and locked
    if (status === "cancelled" && isLocked) {
        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {!isPending && <Unlock className="mr-2 h-4 w-4" />}
                        Déverrouiller la commande
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Déverrouiller la commande ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cela permettra à l'administrateur de modifier le statut de votre commande.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUnlock}>
                            Déverrouiller
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    // Show cancel button if order can be cancelled
    if (!["shipped", "delivered", "cancelled"].includes(status)) {
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
                            Cette action annulera votre commande. L'administrateur ne pourra pas modifier le statut
                            sauf si vous déverrouillez la commande plus tard.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Retour</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancel}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Confirmer l'annulation
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    // Show lock indicator if locked
    if (isLocked) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Verrouillée</span>
            </div>
        )
    }

    return null
}
