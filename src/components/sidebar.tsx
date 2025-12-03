"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { supabase } from "@/lib/supabaseClient";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/projects", label: "Projects (placeholder)" },
  { href: "/dashboard/settings", label: "Settings (placeholder)" }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

    return (
    <aside className="w-full md:w-60 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/80">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 md:px-4 border-b border-slate-800">
        <span className="text-xs font-semibold tracking-wide text-slate-300">
          Dashboard
        </span>
        <button
          onClick={handleLogout}
          className="text-[11px] text-slate-400 hover:text-sky-400"
        >
          Log out
        </button>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 py-2 text-xs md:block md:space-y-1 md:px-0 md:py-3 md:text-sm">
        {items.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "whitespace-nowrap rounded-md px-3 py-2 hover:bg-slate-900",
              pathname === item.href
                ? "bg-slate-900 text-sky-400"
                : "text-slate-300"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
