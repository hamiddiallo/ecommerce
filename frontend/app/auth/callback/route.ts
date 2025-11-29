import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/"

    if (code) {
        const supabase = await createServerSupabaseClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const forwardedHost = request.headers.get("x-forwarded-host") // original origin before load balancer
            const forwardedProto = request.headers.get("x-forwarded-proto") || "https"

            // Check for forwarded host first (for ngrok, reverse proxies, etc.)
            if (forwardedHost) {
                return NextResponse.redirect(`${forwardedProto}://${forwardedHost}${next}`)
            } else {
                // Fallback to origin for local development
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
