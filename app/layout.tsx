import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "Boutique Guinée - Produits de Qualité",
  description:
    "Votre boutique en ligne pour cosmétiques, hygiène, fournitures scolaires et articles ménagers en Guinée",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="antialiased">
      <body className="min-h-screen bg-background text-foreground font-sans">
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
