"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabaseClient";
import { UserMenu } from "@/components/user-menu";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/pricing", label: "Pricing" },
  { href: "/testimonials", label: "Testimonials" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { user, loading } = useUser();
  const { profile } = useProfile(user);

  const isLogged = !!user;
  const isFreePlan = !!profile && profile.plan === "free";

  async function handleMobileLogout() {
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-sky-500" />
          <span className="text-sm font-semibold tracking-tight">
            SaaS Blank
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-14 text-sm md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "transition hover:text-sky-400",
                pathname === item.href && "text-sky-400"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 sm:flex">
          {/* CTA Upgrade visible si l'utilisateur est connecté et sur le plan Free */}
          {!loading && isLogged && isFreePlan && (
            <button
              type="button"
              onClick={() => router.push("/dashboard/account")}
              className="hidden text-[11px] font-medium text-sky-300 underline md:inline-flex"
            >
              Upgrade to Pro
            </button>
          )}

          {!loading && isLogged ? (
            // Menu utilisateur (avatar + My Account + Dashboard + Logout)
            <UserMenu />
          ) : (
            <>
              <Link href="/login" className="btn-outline text-xs md:text-sm">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary text-xs md:text-sm">
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-200 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-4 rounded-full bg-current" />
            <span className="block h-0.5 w-4 rounded-full bg-current" />
          </div>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-slate-800 bg-slate-950 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "rounded-md px-2 py-2 hover:bg-slate-900",
                  pathname === item.href
                    ? "text-sky-400"
                    : "text-slate-200"
                )}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-2 flex gap-2">
              {!loading && isLogged ? (
                <>
                  <Link
                    href="/dashboard"
                    className="btn-outline flex-1 justify-center text-xs"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleMobileLogout}
                    className="btn-primary flex-1 justify-center text-xs"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="btn-outline flex-1 justify-center text-xs"
                    onClick={() => setOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary flex-1 justify-center text-xs"
                    onClick={() => setOpen(false)}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
