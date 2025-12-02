import { createClient } from "@/lib/supabase/client"

/**
 * Get the API base URL based on environment
 * Server-side: uses localhost:5000
 * Client-side: uses Next.js proxy (/api)
 */
function getApiUrl(): string {
    if (typeof window === "undefined") {
        // Server-side
        return process.env.NEXT_PUBLIC_API_URL?.startsWith('http')
            ? process.env.NEXT_PUBLIC_API_URL
            : 'http://localhost:5000/api'
    }
    // Client-side - use Next.js proxy
    return '/api'
}

/**
 * Get authentication headers with Supabase JWT token
 * Only works on client-side
 */
/**
 * Get authentication headers with Supabase JWT token
 * Only works on client-side
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {}

    // Only try to get auth token on client-side
    if (typeof window !== "undefined") {
        try {
            const supabase = createClient()
            if (supabase) {
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.access_token) {
                    headers['Authorization'] = `Bearer ${session.access_token}`
                }
            }
        } catch (error) {
            // Silently fail if auth is not available
            console.warn('Could not get auth token:', error)
        }
    }

    return headers
}

/**
 * Enhanced fetch wrapper with automatic authentication
 * Works on both client and server side
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${getApiUrl()}${endpoint}`
    const authHeaders = await getAuthHeaders()

    // Merge headers
    const headers = {
        ...authHeaders,
        ...(options.headers as Record<string, string>),
    }

    // Set default Content-Type to application/json if not set and body is not FormData
    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
    }

    // If body is FormData, ensure Content-Type is NOT set (browser sets it with boundary)
    if (options.body instanceof FormData) {
        delete headers['Content-Type']
    }

    const mergedOptions: RequestInit = {
        ...options,
        headers,
    }

    return fetch(url, mergedOptions)
}

export const API_URL = getApiUrl()
