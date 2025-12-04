"use client";

import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    flowType: "implicit",          // ⬅️ comme avant
    detectSessionInUrl: true,
    persistSession: true,
    storageKey: "saas-blank-auth",
    autoRefreshToken: true,
  },
});
