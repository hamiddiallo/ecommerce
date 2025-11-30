import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CategoryForm } from "@/components/category-form"
import { CategoriesList } from "@/components/categories-list"
import { AdminNav } from "@/components/admin-nav"

export default async function AdminCategoriesPage() {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
        throw new Error("Supabase n'est pas configuré")
    }

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .single()

    if (!adminUser) {
        redirect("/")
    }

    // Fetch categories
    const { data: categories, error } = await supabase
        .from("categories")
        .select("*")
        .order("name")

    if (error) {
        console.error("Error fetching categories:", error)
    }

    return (
        <>
            <AdminNav />
            <div className="container px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold">Gestion des catégories</h1>
                        <p className="text-muted-foreground mt-2">
                            Créez et gérez les catégories de produits
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Create Form */}
                        <div className="lg:col-span-1">
                            <CategoryForm />
                        </div>

                        {/* Categories List */}
                        <div className="lg:col-span-2">
                            <CategoriesList categories={categories || []} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
