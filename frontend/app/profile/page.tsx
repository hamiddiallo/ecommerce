"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("❌ Les nouveaux mots de passe ne correspondent pas")
      return
    }

    console.log("Mise à jour mot de passe :", passwords)
    alert("✅ Mot de passe modifié (API non encore connecté)")
  }

  return (
    <div className="container mx-auto max-w-xl py-10">
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Changer le mot de passe</CardTitle>
          <CardDescription>
            Mets à jour ton mot de passe en toute sécurité
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-1">
              <Label>Mot de passe actuel</Label>
              <Input
                name="oldPassword"
                type="password"
                placeholder="••••••••"
                value={passwords.oldPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <Label>Nouveau mot de passe</Label>
              <Input
                name="newPassword"
                type="password"
                placeholder="Nouveau mot de passe"
                value={passwords.newPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <Label>Confirmer le nouveau mot de passe</Label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirmer le mot de passe"
                value={passwords.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              🔒 Mettre à jour le mot de passe
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
