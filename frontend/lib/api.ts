const isServer = typeof window === 'undefined';
const API_URL = isServer
    ? (process.env.NEXT_PUBLIC_API_URL?.startsWith('http') ? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:5000/api')
    : (process.env.NEXT_PUBLIC_API_URL || '/api');

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Une erreur est survenue');
    }

    return res.json();
}
