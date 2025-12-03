import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <div className="container py-16 md:py-20">
      <div className="mb-6 text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Sign up
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-sky-400 hover:text-sky-300">
            Log in
          </Link>
        </p>
      </div>
      <AuthForm mode="signup" />
    </div>
  );
}
