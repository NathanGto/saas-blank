// src/lib/supabaseServer.ts
"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createSupabaseServerClient() {
  // Dans ton setup / types Next, cookies() est typé comme Promise<ReadonlyRequestCookies>
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // peut throw dans certains contextes (Server Components en lecture seule)
              cookieStore.set(name, value, options);
            });
          } catch {
            // ignore si les cookies ne sont pas modifiables dans ce contexte
          }
        },
      },
    }
  );
}
