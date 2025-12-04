"use client";

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    flowType: "implicit",          // ⬅️ important
    detectSessionInUrl: true,      // parse le hash de retour Google
    persistSession: true,           // garde la session en localStorage
    storageKey: "saas-blank-auth",
    autoRefreshToken: true,
  }
});
