import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="container py-16 md:py-20">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
        Pricing
      </h1>
      <p className="text-slate-300 mb-10 max-w-xl text-sm md:text-base">
        Simple pricing that you can easily adapt. Update this copy and the
        numbers to match your own business model.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-1">Free</h2>
          <p className="text-sm text-slate-400 mb-4">
            Perfect for quick prototypes and internal tools.
          </p>
          <p className="text-3xl font-semibold mb-4">$0</p>
          <ul className="text-sm text-slate-300 space-y-1 mb-6">
            <li>• Email & password auth</li>
            <li>• Up to 50 users</li>
            <li>• Basic dashboard shell</li>
          </ul>
          <Link href="/signup" className="btn-outline mt-auto">
            Get started
          </Link>
        </div>

        <div className="card border-sky-500/70 p-6 flex flex-col relative">
          <span className="absolute -top-3 right-4 rounded-full bg-sky-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-950">
            Most popular
          </span>
          <h2 className="text-lg font-semibold mb-1">Pro</h2>
          <p className="text-sm text-slate-400 mb-4">
            For founders validating multiple SaaS ideas.
          </p>
          <p className="text-3xl font-semibold mb-1">$29</p>
          <p className="text-xs text-slate-500 mb-4">per month</p>
          <ul className="text-sm text-slate-300 space-y-1 mb-6">
            <li>• Unlimited projects</li>
            <li>• Google OAuth</li>
            <li>• Priority support</li>
          </ul>
          <Link href="/signup" className="btn-primary mt-auto">
            Start Pro
          </Link>
        </div>

        <div className="card p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-1">Enterprise</h2>
          <p className="text-sm text-slate-400 mb-4">
            Custom setup, multi-tenant architecture, SSO & more.
          </p>
          <p className="text-3xl font-semibold mb-4">Let&apos;s talk</p>
          <ul className="text-sm text-slate-300 space-y-1 mb-6">
            <li>• Dedicated support</li>
            <li>• Custom SLAs</li>
            <li>• White-labeling</li>
          </ul>
          <button className="btn-outline mt-auto">Contact sales</button>
        </div>
      </div>
    </div>
  );
}
