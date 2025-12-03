const testimonials = [
  {
    name: "Product Founder",
    role: "Bootstrapped SaaS",
    quote:
      "I can test a new idea in a weekend. Auth, UI and routing are already there."
  },
  {
    name: "Ops Lead",
    role: "Internal tools",
    quote:
      "Instead of yet another spreadsheet, we shipped an internal tool in days."
  },
  {
    name: "CTO",
    role: "Startup",
    quote:
      "It&apos;s a perfect base for experiments without slowing down the core product."
  }
];

export default function TestimonialsPage() {
  return (
    <div className="container py-16 md:py-20 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
          Testimonials
        </h1>
        <p className="text-slate-300 max-w-xl text-sm md:text-base">
          Social proof section. Replace this with your real customers and
          stories.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map(t => (
          <article key={t.name} className="card p-5 space-y-3">
            <p className="text-sm text-slate-100">“{t.quote}”</p>
            <div className="text-xs text-slate-400">
              <p className="font-semibold text-slate-200">{t.name}</p>
              <p>{t.role}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
