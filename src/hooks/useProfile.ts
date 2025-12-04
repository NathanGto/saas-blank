"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  plan: "free" | "pro" | null;
  stripe_customer_id: string | null;
};

export function useProfile(user: { id: string; email?: string | null } | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      if (!user) {
        setProfile(null);
        setLoadingProfile(false);
        return;
      }

      setLoadingProfile(true);

      // 1) On essaye de récupérer un profil existant
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle(); // <-- NE renvoie pas d'erreur si aucune ligne

      if (ignore) return;

      if (error) {
        console.error("Error loading profile", error);
        setLoadingProfile(false);
        return;
      }

      if (data) {
        // Profil déjà existant
        setProfile(data as Profile);
        setLoadingProfile(false);
        return;
      }

      // 2) Aucune ligne : on crée un profil par défaut (plan = free)
      const { data: inserted, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          first_name: null,
          last_name: null,
          plan: "free",
          stripe_customer_id: null,
        })
        .select("*")
        .single();

      if (ignore) return;

      if (insertError) {
        console.error("Error creating profile", insertError);
        setLoadingProfile(false);
        return;
      }

      setProfile(inserted as Profile);
      setLoadingProfile(false);
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [user?.id]); // on relance si l'utilisateur change

  return { profile, loadingProfile, setProfile };
}
