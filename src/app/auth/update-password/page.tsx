"use client";

import { FormEvent, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Toast } from "@/components/toast";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Vérifie qu'on arrive depuis un lien recovery
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
      }
    })();
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      // SUCCESS →
      setToastMsg("Password updated successfully!");

      // Attendre un peu puis redirection
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message ?? "Could not update password.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      {/* Toast */}
      {toastMsg && (
        <Toast
          message={toastMsg}
          type="success"
          onClose={() => setToastMsg(null)}
        />
      )}

      <div className="card w-full max-w-md space-y-5 p-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Choose a new password</h1>
          <p className="text-xs text-slate-400">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-sm">
            <label htmlFor="password" className="block text-slate-200">
              New password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2 text-sm">
            <label htmlFor="confirm" className="block text-slate-200">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-950/40 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary w-full justify-center"
            disabled={pending}
          >
            {pending ? "Updating password..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
