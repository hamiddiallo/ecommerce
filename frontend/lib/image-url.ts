/**
 * Normalizes image URLs to work with Next.js proxy
 * Converts absolute localhost URLs to relative paths
 */
export function normalizeImageUrl(url: string | null | undefined): string {
    if (!url) return "/placeholder.svg"

    // If it's already a relative path starting with /uploads, return as is
    if (url.startsWith("/uploads/")) {
        return url
    }

    // If it's an absolute URL with localhost:5000, extract the path
    if (url.includes("localhost:5000")) {
        const match = url.match(/\/uploads\/.+/)
        return match ? match[0] : "/placeholder.svg"
    }

    // If it starts with http:// or https:// but not localhost, return as is (external image)
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url
    }

    // If it doesn't start with /, add it (assume it's a relative path)
    if (!url.startsWith("/")) {
        return `/uploads/${url}`
    }

    return url
}
