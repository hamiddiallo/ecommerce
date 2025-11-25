// lib/supabase/middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Crée un client Supabase côté serveur pour le middleware ou Server Actions.
 */
export function createServerSupabaseClientForMiddleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
      },
    },
  });
}

/**
 * Middleware pour vérifier la session utilisateur et rediriger si nécessaire.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Si les credentials Supabase ne sont pas configurés, on ignore le middleware
  if (!supabaseUrl || !supabaseKey) {
    console.log("[middleware] Supabase credentials not available, skipping auth");
    return response;
  }

  try {
    const supabase = createServerSupabaseClientForMiddleware(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const publicRoutes = ["/", "/category", "/product", "/auth"];
    const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

    // Redirection si l'utilisateur n'est pas connecté et la route n'est pas publique
    if (!user && !isPublicRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    console.error("[middleware] Error in Supabase middleware:", error);
    return response;
  }
}
