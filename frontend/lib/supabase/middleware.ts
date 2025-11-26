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
    return response;
  }

  try {
    const supabase = createServerSupabaseClientForMiddleware(request);

    let user = null;
    try {
      const { data, error } = await supabase.auth.getUser();

      // Si l'erreur est liée à une session invalide, on la traite comme non authentifié
      if (error && (
        error.message.includes("oauth_client_id") ||
        error.message.includes("Invalid Refresh Token") ||
        error.message.includes("Refresh Token Not Found")
      )) {
        console.log("[middleware] Invalid session detected, treating as unauthenticated");
        user = null;
      } else if (error) {
        throw error;
      } else {
        user = data.user;
      }
    } catch (authError) {
      console.error("[middleware] Auth error:", authError);
      user = null;
    }

    // Définition stricte des routes publiques
    // Seule la page d'accueil '/' et les routes d'auth '/auth/*' sont publiques
    const isHomePage = request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/homepage";
    const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
    const isPublicRoute = isHomePage || isAuthRoute;
    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

    // Redirection si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
    if (!user && !isPublicRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      // Ajouter le paramètre redirect pour revenir à la page demandée après connexion
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Protection des routes admin : vérifier si l'utilisateur est admin
    if (user && isAdminRoute) {
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!adminUser) {
        // User is not an admin, redirect to home
        const url = request.nextUrl.clone();
        url.pathname = "/";
        url.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(url);
      }
    }

    return response;
  } catch (error) {
    console.error("[middleware] Error in Supabase middleware:", error);
    return response;
  }
}
