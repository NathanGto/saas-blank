"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        router.replace("/login");
        return;
      }

      setEmail(session.user.email ?? null);
      setLoading(false);
    }
    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-400">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        Welcome{email ? `, ${email}` : ""} 👋
      </h1>
      <p className="text-sm md:text-base text-slate-300 max-w-2xl">
        This is your generic dashboard. Use it as a shell to plug any feature:
        analytics, AI tools, content editor, client projects, etc. Duplicate
        this project, change the brand, and you have a new SaaS.
      </p>

      <div className="grid gap-4 md:grid-cols-3 mt-4">
        <div className="card p-4">
          <p className="text-xs font-semibold text-slate-400 mb-1">
            Example card
          </p>
          <p className="text-sm text-slate-100">
            Replace these cards with metrics, charts, or whatever your product
            needs.
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold text-slate-400 mb-1">
            Placeholder
          </p>
          <p className="text-sm text-slate-100">
            Use /dashboard/projects or /dashboard/settings routes as stubs for
            new modules.
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold text-slate-400 mb-1">
            Rebranding
          </p>
          <p className="text-sm text-slate-100">
            Change colors, typography and copy to instantly create a different
            product.
          </p>
        </div>
      </div>
    </div>
  );
}
