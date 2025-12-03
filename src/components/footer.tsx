export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-3 py-6 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} SaaS Blank. All rights reserved.</p>
        <p className="text-slate-600">
          Built with Next.js, Supabase and Vercel.
        </p>
      </div>
    </footer>
  );
}
