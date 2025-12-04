"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabaseClient";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const { profile, loadingProfile, setProfile } = useProfile(user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPro = profile?.plan === "pro";

    useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name ?? "");
      setLastName(profile.last_name ?? "");
    }
  }, [profile]);

  if (!loading && !user) {
    router.push("/login");
    return null;
  }

  if (loading || loadingProfile || !profile) {
    return (
      <div className="container py-12">
        <p className="text-sm text-slate-400">Loading account…</p>
      </div>
    );
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { data, error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName || null,
        last_name: lastName || null,
      })
      .eq("id", user!.id)
      .select("*")
      .single();

    if (error) {
      setError(error.message ?? "Could not update profile");
    } else {
      setProfile(data as any);
    }

    setSaving(false);
  }

  async function handleSubscribeOrManage() {
    setSubscribing(true);
    setError(null);

    try {
      const res = await fetch(
        isPro ? "/api/stripe/portal" : "/api/stripe/checkout",
        { method: "POST" }
      );

      if (!res.ok) {
        throw new Error("Unable to init Stripe session");
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Unable to start billing session.");
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My account</h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage your profile and subscription.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr,1.3fr]">
        {/* Profil */}
        <form
          onSubmit={handleSave}
          className="card space-y-4 p-6 rounded-2xl border border-slate-800 bg-slate-950/70"
        >
          <h2 className="text-sm font-semibold">Profile</h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-1 text-xs">
              <label className="block text-slate-300" htmlFor="firstName">
                First name
              </label>
              <input
                id="firstName"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="block text-slate-300" htmlFor="lastName">
                Last name
              </label>
              <input
                id="lastName"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="block text-slate-300">Email</label>
            <p className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-400">
              {user?.email}
            </p>
          </div>

          {error && (
            <p className="rounded-md bg-red-950/40 px-3 py-2 text-[11px] text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-primary mt-2 inline-flex justify-center px-4 py-2 text-xs"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>

        {/* Abonnement */}
        <div className="card space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-sm font-semibold">Subscription</h2>

          <p className="text-xs text-slate-400">
            Current plan:{" "}
            <span className={isPro ? "text-emerald-400" : "text-sky-400"}>
              {isPro ? "Pro" : "Free"}
            </span>
          </p>

          <p className="text-[11px] text-slate-500">
            {isPro
              ? "You have access to all premium features. You can manage your billing from the portal."
              : "Upgrade to Pro to unlock advanced features (longer videos, analytics, more storage...)."}
          </p>

          <button
            type="button"
            onClick={handleSubscribeOrManage}
            disabled={subscribing}
            className="btn-primary w-full justify-center text-xs"
          >
            {subscribing
              ? "Redirecting to Stripe…"
              : isPro
              ? "Manage billing"
              : "Upgrade to Pro"}
          </button>
        </div>
      </div>
    </div>
  );
}
