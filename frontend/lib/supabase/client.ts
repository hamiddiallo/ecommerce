// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Crée et retourne un client Supabase pour le frontend (Client Component).
 * Le client est mis en cache pour éviter de recréer plusieurs instances.
 */
export function createClient() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials not configured");
    return null;
  }

  client = createBrowserClient(supabaseUrl, supabaseKey);
  return client;
}
