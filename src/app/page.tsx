import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 sm:pb-20 lg:px-8 lg:pt-20 lg:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr,1fr]">
          {/* Left column */}
          <div className="space-y-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sky-400">
              SaaS boilerplate
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Ship new SaaS ideas in{" "}
              <span className="text-sky-400">days</span>, not months.
            </h1>
            <p className="max-w-xl text-sm text-slate-300 sm:text-base">
              A white-label SaaS template with authentication, dashboard and
              marketing pages. Rebrand it, plug your feature, deploy to Vercel.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/signup" className="btn-primary">
                Start for free
              </Link>
              <Link href="/pricing" className="btn-outline">
                View pricing
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 pt-3 text-[11px] text-slate-400 sm:text-xs">
              <span>Next.js 16 App Router</span>
              <span>•</span>
              <span>Supabase Auth</span>
              <span>•</span>
              <span>Tailwind CSS</span>
            </div>
          </div>

          {/* Right column */}
          <div className="card flex h-full flex-col justify-between p-4 sm:p-5">
            <div>
              <p className="mb-3 text-[11px] font-semibold text-slate-400">
                Preview
              </p>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-xs text-slate-300 sm:p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Dashboard</span>
                </div>
                <p>
                  Generic layout with sidebar navigation, ready to host any
                  feature module: analytics, AI tools, project management,
                  whatever you want to validate.
                </p>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-slate-500 sm:mt-6">
              Replace copy, colors and logo → you have a new SaaS in a few
              minutes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
