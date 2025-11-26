import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PasswordChangeForm } from "@/components/password-change-form"

export default async function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container max-w-2xl py-8">
          <PasswordChangeForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}
