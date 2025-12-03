import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="container py-16 md:py-20">
      <div className="mb-6 text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Log in
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-sky-400 hover:text-sky-300">
            Sign up
          </Link>
        </p>
      </div>
      <AuthForm mode="login" />
    </div>
  );
}
