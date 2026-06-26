import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getCurrentUser } from "@/lib/auth";

const PORTALS = [
  {
    title: "About",
    subtitle: "The Creator",
    href: "/about",
    icon: "info",
    backTitle: "About MirrorMeMusic",
    backCopy: "Learn about the project, its creator, and what the AI Strategist is built to do.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDM9bFCt4aGPaRO6X3LDKFFDiZFpbP6MiZY1MfwbJAHXE_lwMaPrw2kbqim7mSgR-Rvx708GWQpqDYDNj3RqlYHzrsWG47j4Pmeo8D5ptRYWIpg_LKUB5rHsp_DA0oVj1ExASrpztwF_5TtgCkAAlk28fmftrVFrK8wFnKmZN8_bNZwHJVTczxHqy78eq4L6P6jNEcx-aFetvETFR2e4vXJh9x-xNv5dBn_6426pBqRl2EnoUB7lCbnnr8KwdoYy-yVptY9mHY7_6I",
    cta: "Learn More",
    requiresAuth: false,
  },
  {
    title: "Library",
    subtitle: "Discover",
    href: "/case-study",
    icon: "album",
    backTitle: "'MIRROR'",
    backCopy: "Explore your catalog and released works.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqkcXZJFVjhs2INJSi9wAYvUjXB9OYpX8nQDY6eWkSl7JlgbeOINOmBOvVNgSNXNOGfCsQXe8KUZk7-0LvE-xARgNm6aCPlDJW8nrXWoVFkL9RgSS-nUgdBidWjhmWOpI8zJ75R-vLl4q42b_gOFZSXdyJvnoZ7tgd-7B-ThYZdd3hbppzJSjdOwDT8SUtOnVHpxSq8AIrrC1AX90b52GZdFYJa5eis5MDZHnvrGRzTz4Rd2ngGO6olAXxVgMGUTZUaQ3bmhpZJvw",
    cta: "Explore Artifact",
    requiresAuth: true,
  },
  {
    title: "Strategic AI",
    subtitle: "Summon",
    href: "/strategist",
    icon: "psychiatry",
    backTitle: "AI Strategist",
    backCopy: "Consult the AI strategist for career and release planning.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4jsno8niO28nInAaYFquCgooFwYr-IqkGXbwcHQjn_eWvrx8Zpd_gsZ4PSqdBRbodIK6gKwIqYn1r3tyH8zsLYbx01rlNrr4fjXtjcNlxEQDk70VFfDCH_MsVjp5xZ7qSbHQq8Ji895qSykUvIJDXWDma4DPJpwOwJiJ5cweaEYwRHszNHxKfu9Fx91IKAHlZvxQXZEKOgzYJXdTkcqbhjfr7X0UL3H8CScSJJyI2ocCSbBVWUntc-BTStbyVqLaFOxXDSxTYUQM",
    cta: "Initiate",
    requiresAuth: true,
  },
];

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader active="Portals" user={user} />
      <main className="flex-grow relative z-10 flex flex-col items-center justify-center py-24 md:py-32 px-4 md:px-16">
        <div className="text-center mb-24 max-w-7xl mx-auto">
          <div className="w-full max-w-7xl mx-auto mb-6 overflow-visible animate-fade-up">
            <svg viewBox="0 0 1400 300" className="w-full h-auto drop-shadow-[0_0_20px_rgba(214,191,221,0.2)]">
              <defs>
                <path id="header-arc" d="M 70,250 Q 700,60 1330,250" fill="transparent" />
              </defs>
              <text
                className="fill-primary font-headline-lg"
                style={{ fontFamily: "var(--font-bodoni-moda), serif", fontSize: "92px", letterSpacing: "-0.02em" }}
              >
                <textPath href="#header-arc" startOffset="50%" textAnchor="middle">
                  Welcome to MirrorMeMusic
                </textPath>
              </text>
            </svg>
          </div>
          {!user && (
            <p className="font-body-md text-body-md text-on-surface-variant italic animate-fade-up-delay-1">
              An AI-guided platform for independent artists.{" "}
              <Link href="/signup" className="text-primary hover:underline transition-colors duration-300">
                Begin the ritual
              </Link>{" "}
              to unlock your library.
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-[1400px] mx-auto">
          {PORTALS.map((portal, i) => (
            <div
              key={portal.href}
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
              className={`group h-[540px] [perspective:1200px] w-full animate-fade-up ${i === 1 ? "mt-0 md:mt-16" : ""}`}
            >
              <div className="relative h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] preserve-3d group-hover:rotate-y-180">
                <div className="absolute inset-0 backface-hidden ornate-frame transition-all duration-500 group-hover:-translate-y-2">
                  <div className="w-full h-full mirror-surface flex flex-col items-center justify-center p-8">
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen z-0 pointer-events-none filter contrast-125 brightness-75"
                      style={{ backgroundImage: `url('${portal.image}')`, opacity: 0.2, mixBlendMode: "screen" }}
                    />
                    <div className="relative z-10 flex flex-col items-center etched-content mirror-glow bg-black/35 backdrop-blur-[2px] rounded-2xl px-8 py-6">
                      <h2 className="font-headline-md text-headline-md tracking-tighter mb-2">{portal.title}</h2>
                      <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent my-4" />
                      <p className="font-label-sm text-label-sm tracking-widest uppercase mt-2">{portal.subtitle}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#110b1c]/95 backdrop-blur-2xl border-2 border-[#1f182a] flex flex-col items-center justify-center p-10 text-center shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] overflow-hidden rounded-[50%_/_60%_60%_40%_40%]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary opacity-50" />
                  <span className="material-symbols-outlined text-[32px] text-tertiary/50 mb-6 group-hover:drop-shadow-[0_0_25px_rgba(221,183,255,0.7)]">
                    {portal.icon}
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{portal.backTitle}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-8">
                    {portal.backCopy}
                  </p>
                  <Link
                    href={portal.requiresAuth && !user ? "/login" : portal.href}
                    className="relative group/btn overflow-hidden px-8 py-4 border border-tertiary rounded-full font-label-sm text-label-sm text-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(221,183,255,0.4)] bg-transparent press-scale"
                  >
                    <span className="absolute inset-0 w-full h-full bg-tertiary/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 flex items-center gap-2">
                      {portal.cta}{" "}
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
