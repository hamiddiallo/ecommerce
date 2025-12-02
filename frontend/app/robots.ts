import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/cart/', '/checkout/', '/profile/'],
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}
