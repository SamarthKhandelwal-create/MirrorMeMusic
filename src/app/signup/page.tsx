import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 gap-10">
        <div className="text-center space-y-3 animate-fade-up">
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tighter">
            Begin the Ritual
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant italic">
            Create your library and start your first session with the AI Strategist.
          </p>
        </div>
        <Suspense fallback={null}>
          <div className="w-full max-w-md animate-fade-up-delay-1">
            <AuthForm mode="signup" />
          </div>
        </Suspense>
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest animate-fade-up-delay-2">
          Already initiated?{" "}
          <Link href="/login" className="text-primary hover:underline transition-colors duration-300">
            Sign in
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
