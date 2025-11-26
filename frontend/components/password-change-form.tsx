"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function PasswordChangeForm() {
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("Les nouveaux mots de passe ne correspondent pas")
            return
        }

        if (passwords.newPassword.length < 6) {
            toast.error("Le mot de passe doit contenir au moins 6 caractères")
            return
        }

        setIsLoading(true)

        try {
            const supabase = createClient()

            // Update password
            const { error } = await supabase.auth.updateUser({
                password: passwords.newPassword,
            })

            if (error) throw error

            toast.success("Mot de passe modifié avec succès")
            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la modification du mot de passe")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button variant="ghost" asChild className="mb-6">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Changer le mot de passe</CardTitle>
                            <CardDescription>
                                Mettez à jour votre mot de passe en toute sécurité
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                placeholder="••••••••"
                                value={passwords.currentPassword}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                placeholder="Minimum 6 caractères"
                                value={passwords.newPassword}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                minLength={6}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Retapez le nouveau mot de passe"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                minLength={6}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Mettre à jour le mot de passe
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}
