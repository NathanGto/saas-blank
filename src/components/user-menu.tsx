"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/hooks/useUser";
import { useProfile } from "@/hooks/useProfile";
import clsx from "clsx";

export function UserMenu() {
  const router = useRouter();
  const { user } = useUser();
  const { profile } = useProfile(user);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initial =
    (profile?.first_name?.[0] ??
      profile?.last_name?.[0] ??
      user.email?.[0] ??
      "U").toUpperCase();

  const plan = profile?.plan ?? "free";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs shadow-sm hover:border-sky-500"
      >
        {/* Badge plan visible en permanence */}
        <span
          className={clsx(
            "rounded-full px-2 py-0.5 text-[10px] font-medium",
            plan === "pro"
              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-600/60"
              : "bg-slate-800 text-slate-300 border border-slate-600"
          )}
        >
          {plan === "pro" ? "Pro" : "Free"}
        </span>

        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-xs font-semibold text-slate-950">
          {initial}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-950/95 p-3 text-xs shadow-xl">
          <div className="mb-3 border-b border-slate-800 pb-3">
            <p className="text-[11px] font-semibold text-slate-100">
              {profile?.first_name || profile?.last_name
                ? `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim()
                : user.email}
            </p>
            {user.email && (
              <p className="truncate text-[10px] text-slate-400">
                {user.email}
              </p>
            )}
            <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300">
              Plan:{" "}
              <span className={plan === "pro" ? "text-emerald-400" : "text-sky-400"}>
                {plan === "pro" ? "Pro" : "Free"}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              router.push("/dashboard");
              setOpen(false);
            }}
            className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-slate-900"
          >
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => {
              router.push("/dashboard/account");
              setOpen(false);
            }}
            className="mt-1 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-slate-900"
          >
            <span>My Account</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-red-300 hover:bg-red-950/40"
          >
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
