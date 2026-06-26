import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArchiveManager } from "@/components/ArchiveManager";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function CaseStudyPage() {
  const user = await getCurrentUser();
  const projects = user
    ? await prisma.archiveProject.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader active="Library" user={user} />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-16 py-16 md:py-32 space-y-32">
        <section className="flex flex-col items-center justify-center space-y-16 text-center animate-fade-up">
          <h1 className="font-display-lg text-display-lg text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Library
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Every release, demo, and artifact lives in your library. A comprehensive exploration of
            digital identity — the strategic bridge between artistic intent and algorithmic
            discovery.
          </p>
        </section>

        <section className="border-t border-primary/20 pt-16 animate-fade-up-delay-1">
          {user ? (
            <ArchiveManager
              initialProjects={projects.map((p: typeof projects[number]) => ({
                ...p,
                createdAt: p.createdAt.toISOString(),
              }))}
            />
          ) : (
            <div className="max-w-xl mx-auto text-center bronze-filigree-border space-y-6">
              <h2 className="font-headline-lg text-headline-lg text-primary italic">Your Library Awaits</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Sign in to catalog your releases and track your library.
              </p>
              <Link
                href="/signup"
                className="inline-block px-6 py-3 border border-primary/50 rounded-full font-label-sm text-label-sm text-primary hover:bg-primary/10 transition-all duration-300 press-scale"
              >
                Begin the Ritual
              </Link>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
