"use client";

import { useMemo, useState } from "react";
import { OracleQuestionnaire, type VaultProject } from "@/components/OracleQuestionnaire";

type Phase = {
  id: string;
  projectName: string;
  phaseNumber: number;
  title: string;
  description: string;
  status: string;
  alignmentPercent: number;
  tags: string;
};

const STATUS_ICON: Record<string, string> = {
  completed: "check_circle",
  in_progress: "pending",
  locked: "lock",
};

export function RoadmapManager({
  initialPhases,
  vaultProjects = [],
}: {
  initialPhases: Phase[];
  vaultProjects?: VaultProject[];
}) {
  const [phases, setPhases] = useState(initialPhases);
  const [showForm, setShowForm] = useState(false);

  const projects = useMemo(() => {
    const map = new Map<string, Phase[]>();
    for (const phase of phases) {
      const list = map.get(phase.projectName) ?? [];
      list.push(phase);
      map.set(phase.projectName, list);
    }
    return Array.from(map.entries()).map(([name, list]) => ({
      name,
      phases: list.sort((a, b) => a.phaseNumber - b.phaseNumber),
    }));
  }, [phases]);

  async function handleGenerate(input: {
    projectName: string;
    answers: { question: string; answer: string }[];
  }) {
    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error || "Could not generate roadmap." };
      }
      setPhases((prev) => [
        ...prev.filter((p) => p.projectName !== input.projectName),
        ...data.phases,
      ]);
      setShowForm(false);
      return { ok: true };
    } catch {
      return { ok: false, error: "Could not reach the server. Please try again." };
    }
  }

  async function advancePhase(phase: Phase, allPhases: Phase[]) {
    await fetch(`/api/roadmap/${phase.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed", alignmentPercent: 100 }),
    });
    const next = allPhases.find((p) => p.phaseNumber === phase.phaseNumber + 1);
    if (next) {
      await fetch(`/api/roadmap/${next.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "in_progress", alignmentPercent: 10 }),
      });
    }
    setPhases((prev) =>
      prev.map((p) => {
        if (p.id === phase.id) return { ...p, status: "completed", alignmentPercent: 100 };
        if (next && p.id === next.id) return { ...p, status: "in_progress", alignmentPercent: 10 };
        return p;
      })
    );
  }

  return (
    <div className="space-y-16">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="gradient-stroke rounded-lg px-8 py-4 bg-transparent hover:bg-primary-container/10 transition-all duration-300 flex items-center gap-3 press-scale"
        >
          <span className="font-label-md text-label-md uppercase tracking-widest text-primary">
            Generate New Strategy
          </span>
          <span className="material-symbols-outlined text-primary">add_circle</span>
        </button>
      </div>

      {showForm && (
        <OracleQuestionnaire
          vaultProjects={vaultProjects}
          onComplete={handleGenerate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {projects.length === 0 && !showForm && (
        <p className="text-on-surface-variant italic text-center font-body-md">
          No active projects yet. Generate a new strategy to begin.
        </p>
      )}

      {projects.map(({ name, phases: projectPhases }) => {
        const activePhase = projectPhases.find((p) => p.status === "in_progress");
        const completedCount = projectPhases.filter((p) => p.status === "completed").length;
        const activeCredit = (activePhase?.alignmentPercent ?? 0) / 100;
        const pct = Math.round(((completedCount + activeCredit) / projectPhases.length) * 100);

        return (
          <section key={name} className="flex flex-col gap-8 animate-fade-up">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-secondary amethyst-indicator animate-pulse" />
              <h2 className="font-headline-md text-headline-md text-primary amethyst-text-glow">
                Active Project: {name}
              </h2>
            </div>
            <div className="etched-glass filigree-corner p-10 rounded-xl flex flex-col gap-8">
              <div className="flex justify-between items-end relative z-10">
                <div>
                  <div className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-2">
                    Strategic Alignment
                  </div>
                  <div className="font-headline-lg text-headline-lg text-primary">{pct}%</div>
                </div>
              </div>
              <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden relative z-10 border border-outline-variant/30">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-container to-primary rounded-full progress-glow transition-[width] duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projectPhases.map((phase) => {
                const isActive = phase.status === "in_progress";
                const isLocked = phase.status === "locked";
                return (
                  <div
                    key={phase.id}
                    className={`etched-glass filigree-corner rounded-xl p-8 flex flex-col gap-8 transition-all duration-500 relative ${
                      isActive ? "md:col-span-2 border-primary/40" : ""
                    } ${isLocked ? "opacity-70 hover:opacity-100" : ""}`}
                  >
                    <div className="flex justify-between items-start relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                          isActive
                            ? "bg-secondary-container/20 border-secondary/50"
                            : "bg-surface-container-low border-outline-variant"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined ${isActive ? "text-secondary animate-pulse" : "text-primary"}`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {STATUS_ICON[phase.status] ?? "lock"}
                        </span>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                        PHASE {phase.phaseNumber}
                      </span>
                    </div>
                    <div className="relative z-10 mt-auto flex flex-col gap-3">
                      <h3 className="font-headline-lg text-headline-lg text-on-surface tracking-tight amethyst-text-glow">
                        {phase.title}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        {phase.description}
                      </p>
                      {isActive && (
                        <button
                          onClick={() => advancePhase(phase, projectPhases)}
                          className="self-start font-label-md text-label-md uppercase tracking-widest text-primary bg-primary-container/10 px-6 py-3 rounded border border-primary/30 hover:bg-primary-container/20 transition-all flex items-center gap-2 whitespace-nowrap mt-2 press-scale"
                        >
                          Mark Complete <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
