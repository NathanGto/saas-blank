// src/lib/supabaseClient.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client unique pour le browser
export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
