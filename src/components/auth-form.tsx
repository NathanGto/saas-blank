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

async function handleGoogleLogin() {
  setPending(true);
  setError(null);
  try {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`
      }
    });

    if (error) throw error;
    // Supabase redirige vers Google puis vers /auth/callback
  } catch (err: any) {
    setError(err.message ?? "Google sign-in failed");
    setPending(false);
  }
}

  return (
    <div className="card max-w-md w-full p-6 space-y-5 mx-auto">
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
          <p className="text-xs text-red-400 bg-red-950/40 rounded-md px-3 py-2">
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
        <span>or</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={pending}
        className="btn-outline w-full justify-center text-xs"
      >
        Continue with Google
      </button>
    </div>
  );
}
