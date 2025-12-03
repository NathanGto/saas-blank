export default function AboutPage() {
  return (
    <div className="container py-16 md:py-20 space-y-6">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
        About us
      </h1>
      <p className="max-w-2xl text-sm md:text-base text-slate-300">
        SaaS Blank is a white-label application template. The goal: help you
        iterate on SaaS ideas fast, by giving you a modern foundation that you
        can rebrand and extend without touching the core plumbing every time.
      </p>
      <p className="max-w-2xl text-sm md:text-base text-slate-300">
        Auth, routing, design system, dashboard shell — all the boring pieces
        are already solved. You focus on the actual problem you want to solve
        for your users.
      </p>
    </div>
  );
}
