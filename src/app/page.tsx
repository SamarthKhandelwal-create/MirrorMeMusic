import fs from "fs";
import path from "path";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LobbyMusic } from "@/components/LobbyMusic";
import { HomeMirror } from "@/components/HomeMirror";
import { PortalCard } from "@/components/PortalCard";
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
    cta: "Explore",
    requiresAuth: true,
  },
  {
    title: "Strategic AI",
    subtitle: "Open",
    href: "/strategist",
    icon: "psychiatry",
    backTitle: "AI Strategist",
    backCopy: "Chat with the AI Strategist for career and release planning.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4jsno8niO28nInAaYFquCgooFwYr-IqkGXbwcHQjn_eWvrx8Zpd_gsZ4PSqdBRbodIK6gKwIqYn1r3tyH8zsLYbx01rlNrr4fjXtjcNlxEQDk70VFfDCH_MsVjp5xZ7qSbHQq8Ji895qSykUvIJDXWDma4DPJpwOwJiJ5cweaEYwRHszNHxKfu9Fx91IKAHlZvxQXZEKOgzYJXdTkcqbhjfr7X0UL3H8CScSJJyI2ocCSbBVWUntc-BTStbyVqLaFOxXDSxTYUQM",
    cta: "Open",
    requiresAuth: true,
  },
];

export default async function Home() {
  const user = await getCurrentUser();
  const hasCrack = fs.existsSync(path.join(process.cwd(), "public", "mirror", "crack.png"));

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader active="Home" user={user} />
      <LobbyMusic />
      <main className="flex-grow relative z-10 flex flex-col items-center justify-center py-24 md:py-32 px-4 md:px-16">
        <div className="text-center mb-24 max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-up">
            <HomeMirror hasCrack={hasCrack} />
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant italic animate-fade-up-delay-1 max-w-xl mx-auto">
            Face your reflection. Make the right choice.
          </p>
          {!user && (
            <p className="font-body-md text-body-md text-on-surface-variant italic animate-fade-up-delay-2 mt-4">
              An AI-guided platform for independent artists.{" "}
              <Link href="/signup" className="text-primary hover:underline transition-colors duration-300">
                Sign up
              </Link>{" "}
              to unlock your library.
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 w-full max-w-md lg:max-w-[1400px] mx-auto">
          {PORTALS.map((portal, i) => (
            <PortalCard
              key={portal.href}
              portal={portal}
              href={portal.requiresAuth && !user ? "/login" : portal.href}
              delay={`${0.2 + i * 0.1}s`}
              offset={i === 1}
            />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
