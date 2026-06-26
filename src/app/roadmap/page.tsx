import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RoadmapManager } from "@/components/RoadmapManager";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function RoadmapPage() {
  const user = await getCurrentUser();
  const [phases, vaultProjects] = user
    ? await Promise.all([
        prisma.roadmapPhase.findMany({
          where: { userId: user.id },
          orderBy: [{ projectName: "asc" }, { phaseNumber: "asc" }],
        }),
        prisma.archiveProject.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
        }),
      ])
    : [[], []];

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader active="AI Strategist" user={user} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-12 py-12 lg:py-24 z-10 flex flex-col gap-16">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 animate-fade-up">
          <div className="flex flex-col gap-4">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tighter amethyst-text-glow">
              Project Roadmap
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              A comprehensive overview of your release strategy. Monitor your project milestones and
              strategic alignment.
            </p>
          </div>
        </section>

        {user ? (
          <div className="animate-fade-up-delay-1">
            <RoadmapManager
              initialPhases={phases}
              vaultProjects={vaultProjects.map((p) => ({
                id: p.id,
                title: p.title,
                type: p.type,
                description: p.description,
              }))}
            />
          </div>
        ) : (
          <div className="max-w-xl mx-auto text-center etched-glass rounded-xl p-10 space-y-6 animate-fade-up-delay-1">
            <h2 className="font-headline-lg text-headline-lg text-primary">Your Roadmap Awaits</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Sign in to let the AI Strategist draft a release strategy for your next project.
            </p>
            <Link
              href="/signup"
              className="inline-block px-6 py-3 border border-primary/50 rounded-full font-label-sm text-label-sm text-primary hover:bg-primary/10 transition-all duration-300 press-scale"
            >
              Sign Up
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
