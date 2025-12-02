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
async function getAuthHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    }

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

    const mergedOptions: RequestInit = {
        ...options,
        headers: {
            ...authHeaders,
            ...options.headers,
        },
    }

    return fetch(url, mergedOptions)
}

export const API_URL = getApiUrl()
