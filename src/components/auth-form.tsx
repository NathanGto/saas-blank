"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup";

interface AuthFormProps {
  mode: Mode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLogin = mode === "login";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  // --- Core OAuth helper (interne)
  async function handleOAuthProvider(
    provider: "google" | "linkedin_oidc" | "apple"
  ) {
    setPending(true);
    setError(null);

    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${origin}/auth/callback`
        }
      });

      if (error) throw error;
      // Redirection gérée par Supabase (puis /auth/callback)
    } catch (err: any) {
      const providerName =
        provider === "google"
          ? "Google"
          : provider === "linkedin_oidc"
          ? "LinkedIn"
          : "Apple";

      setError(err.message ?? `${providerName} sign-in failed`);
      setPending(false);
    }
  }

  async function handleGoogleLogin() {
    return handleOAuthProvider("google");
  }

  async function handleLinkedInLogin() {
    return handleOAuthProvider("linkedin_oidc");
  }

  async function handleAppleLogin() {
    return handleOAuthProvider("apple");
  }

  return (
    <div className="card mx-auto w-full max-w-md space-y-5 p-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-xs text-slate-400">
          {isLogin
            ? "Log in to access your dashboard."
            : "Sign up and start testing your SaaS ideas."}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
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

        <div className="space-y-2 text-sm">
          <label htmlFor="password" className="block text-slate-200">
            Password
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
          {pending
            ? isLogin
              ? "Logging in..."
              : "Creating account..."
            : isLogin
            ? "Log in"
            : "Sign up"}
        </button>
      </form>

      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <div className="h-px flex-1 bg-slate-800" />
        <span>or continue with</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      {/* Row de logos cliquables */}
      <div className="flex items-center justify-center gap-3">
        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={pending}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 text-xs shadow-sm transition hover:border-sky-500 hover:bg-slate-800 disabled:opacity-60"
        >
          <span className="sr-only">Continue with Google</span>
          <span className="text-lg font-semibold text-slate-100">G</span>
        </button>

        {/* LinkedIn */}
        <button
          type="button"
          onClick={handleLinkedInLogin}
          disabled={pending}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 text-xs shadow-sm transition hover:border-sky-500 hover:bg-slate-800 disabled:opacity-60"
        >
          <span className="sr-only">Continue with LinkedIn</span>
          <span className="text-[13px] font-bold text-slate-100">in</span>
        </button>

        {/* Apple */}
        <button
          type="button"
          onClick={handleAppleLogin}
          disabled={pending}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 text-xs shadow-sm transition hover:border-sky-500 hover:bg-slate-800 disabled:opacity-60"
        >
          <span className="sr-only">Continue with Apple</span>
          <span className="text-xl text-slate-100"></span>
        </button>
      </div>
    </div>
  );
}
