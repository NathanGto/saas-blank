"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/update-password`
      });

      if (error) throw error;

      setSuccess("Check your inbox to reset your password.");
    } catch (err: any) {
      setError(err.message ?? "Could not send reset email.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="card w-full max-w-md space-y-5 p-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Reset your password</h1>
          <p className="text-xs text-slate-400">
            Enter the email associated with your account. We&apos;ll send you a
            link to create a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-sm">
            <label htmlFor="email" className="block text-slate-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-950/40 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-md bg-emerald-950/40 px-3 py-2 text-xs text-emerald-400">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary w-full justify-center"
            disabled={pending}
          >
            {pending ? "Sending link..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}
