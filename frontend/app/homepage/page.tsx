"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { normalizeImageUrl } from "@/lib/image-url"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"

// Catégories de produits
const categories = [
    { id: "7c598378-c484-4f61-b65d-6e6ac6b8ae24", name: "Articles Ménagers", slug: "articles-menagers", description: "Ustensiles et équipements pour la maison" },
    { id: "813d237b-f703-4c72-a253-989a3b32d463", name: "Accessoires", slug: "accessoires", description: "Divers accessoires et articles" },
    { id: "926eea21-62c1-47ba-a9eb-ecc34e7337ad", name: "Cosmétiques", slug: "cosmetiques", description: "Produits de beauté et soins corporels" },
    { id: "c3ccad8a-3852-4aa9-ac54-6516f2263edb", name: "Cuisine", slug: "cuisine", description: "Outils et accessoires de cuisine" },
    { id: "d32a95fd-7445-4607-9915-0812a9a38382", name: "Électronique", slug: "electronique", description: "Appareils et accessoires électroniques" },
    { id: "d6b3a227-d7b7-473d-84be-371fa75cb687", name: "Fournitures Scolaires", slug: "fournitures-scolaires", description: "Cahiers, stylos, et matériel scolaire" },
    { id: "f868ecb2-a918-491b-b687-1f3f5b8f805b", name: "Hygiène", slug: "hygiene", description: "Produits d'hygiène personnelle" },
]

// Typage des items de commande Supabase
interface OrderItem {
    product_id: string
    product_name: string
    quantity: number
    image_url?: string
}

export default function HomePage() {
    const [topProducts, setTopProducts] = useState<OrderItem[]>([])

    useEffect(() => {
        const fetchTopProducts = async () => {
            const supabase = createClient()
            if (!supabase) return

            const { data, error } = await supabase
                .from("order_items")
                .select(`
          product_id,
          product_name,
          quantity,
          products!inner(image_url)
        `)

            if (error || !data) {
                console.error("Erreur Supabase:", error?.message)
                return
            }

            // Calcul du total vendu par produit
            const salesMap: Record<string, { product_name: string; total_sold: number; image_url?: string }> = {}
            data.forEach((item: any) => {
                if (!salesMap[item.product_id]) {
                    salesMap[item.product_id] = { product_name: item.product_name, total_sold: 0, image_url: item.products?.image_url || "" }
                }
                salesMap[item.product_id].total_sold += item.quantity
            })

            const top = Object.entries(salesMap)
                .map(([product_id, info]) => ({
                    product_id,
                    product_name: info.product_name,
                    quantity: info.total_sold,
                    image_url: info.image_url,
                }))
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 5)

            setTopProducts(top)
        }

        fetchTopProducts()
    }, [])

    return (
        <main className="flex flex-col">

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <div className="container mx-auto px-6 py-24 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Bienvenue chez ETS MLF</h1>
                    <p className="text-lg md:text-2xl mb-8">
                        Votre boutique premium pour tous vos besoins : maison, beauté, électronique et plus encore.
                    </p>
                    <Button className="px-6 py-3 text-lg font-semibold" asChild>
                        <Link href="/">Découvrir nos produits</Link>
                    </Button>
                </div>
            </section>

            {/* Categories Section */}
            <section className="container mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold mb-10 text-center">Nous vous proposons des produits de toutes sorte </h2>
                <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            className="group block rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-lg hover:border-indigo-500"
                        >
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-600">{cat.name}</h3>
                            <p className="text-gray-600">{cat.description}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Top Products Slider */}
            {topProducts.length > 0 && (
                <section className="bg-gray-50 py-16">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold mb-8 text-center">Nos produits les plus vendus</h2>
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            navigation
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                        >
                            {topProducts.map((p) => (
                                <SwiperSlide key={p.product_id}>
                                    <div className="border rounded-xl p-6 bg-white shadow hover:shadow-xl transition flex flex-col items-center">
                                        {p.image_url ? (
                                            <img src={normalizeImageUrl(p.image_url)} alt={p.product_name} className="h-60 w-full object-cover rounded-md mb-4" />
                                        ) : (
                                            <div className="h-60 w-full bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                                                <span className="text-gray-500">Pas d'image</span>
                                            </div>
                                        )}
                                        <h3 className="text-xl font-semibold mb-2 text-center">{p.product_name}</h3>
                                        {/* <p className="text-gray-600 text-center">Ventes: {p.quantity}</p> */}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </section>
            )}

            {/* About Section */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <img
                            src={normalizeImageUrl("koto.jpeg")}
                            alt="Gérant ETS MLF"
                            className="rounded-xl shadow-lg w-full object-cover h-80 md:h-full"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold mb-4">À propos de notre gérant</h2>
                        <p className="text-gray-800 mb-4">
                            M. Mouctar Diallo est un entrepreneur passionné et visionnaire, engagé à offrir à ses clients une expérience d’achat exceptionnelle. Fort de son expertise et de son sens aigu du service, il met un point d’honneur à sélectionner avec soin chaque produit disponible chez ETS MLF, en veillant à ce que la qualité, la durabilité et l’innovation soient au rendez-vous.
                        </p>
                        <p className="text-gray-700  mb-4">
                            Depuis la création de la boutique, M. Mouctar s’emploie à créer un environnement où la diversité des produits répond aux besoins variés de chaque client, qu’il s’agisse d’articles ménagers, d’accessoires, de cosmétiques ou de fournitures électroniques et scolaires. Sa démarche est guidée par la conviction que chaque produit doit apporter confort, praticité et satisfaction.
                        </p>
                        <p className="text-gray-700  mb-4">
                            Sous sa direction, ETS MLF s’est imposée comme une référence en matière de qualité et de fiabilité, offrant un service client irréprochable et des conseils personnalisés. M. Mouctar travaille chaque jour avec rigueur et passion pour que chaque client se sente valorisé et pour que l’expérience d’achat soit agréable, fluide et mémorable.
                        </p>
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="bg-indigo-600 text-white py-20 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à passer commande ?</h2>
                <p className="mb-8 text-lg md:text-xl">
                    Parcourez nos produits et profitez de notre livraison rapide et sécurisée.
                </p>
                <Button className="px-6 py-3 text-lg font-semibold" asChild>
                    <Link href="/">Commencer vos achats</Link>
                </Button>
            </section>

        </main>
    )
}