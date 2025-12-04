"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handle() {
      try {
        // À ce stade, Supabase a déjà tenté de lire la session dans l'URL
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (session) {
          // Session OK → go dashboard
          router.replace("/dashboard");
        } else {
          // Pas de session → retour login
          setError("Could not complete sign-in. Please try again.");
          setTimeout(() => router.replace("/login"), 2000);
        }
      } catch (err: any) {
        setError(err.message ?? "OAuth callback failed");
        setTimeout(() => router.replace("/login"), 2000);
      }
    }

    handle();
  }, [router]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem-3.5rem)] max-w-6xl items-center justify-center px-4">
      <div className="card max-w-md w-full p-6 space-y-4 text-sm">
        <p className="font-medium">
          Finishing sign-in. Please wait...
        </p>
        {error && (
          <p className="text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
