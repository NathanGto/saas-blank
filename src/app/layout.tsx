import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "SaaS Blank",
  description:
    "A rebrandable SaaS boilerplate with Next.js, Supabase and Vercel."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
        <Navbar />
        {/* Conteneur central commun à toutes les pages */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
