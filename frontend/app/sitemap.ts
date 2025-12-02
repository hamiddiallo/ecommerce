import { MetadataRoute } from 'next'

const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes
    const routes = [
        '',
        '/category/cosmetiques',
        '/category/hygiene',
        '/category/scolaire',
        '/category/menage',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Fetch products for dynamic routes
    let products = []
    try {
        const res = await fetch('http://localhost:5000/api/products?limit=1000')
        if (res.ok) {
            const data = await res.json()
            products = Array.isArray(data) ? data : (data.data || [])
        }
    } catch (error) {
        console.error('Failed to generate product sitemap:', error)
    }

    const productRoutes = products.map((product: any) => ({
        url: `${BASE_URL}/product/${product.id}`,
        lastModified: new Date(product.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    return [...routes, ...productRoutes]
}
