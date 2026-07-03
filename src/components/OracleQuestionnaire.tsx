"use client";

import { useState } from "react";

export type VaultProject = {
  id: string;
  title: string;
  type: string;
  description: string;
};

const CUSTOM_OPTION = "__custom__";

const QUESTIONS = [
  {
    key: "genre",
    question: "What genre or sonic style best describes this project?",
    placeholder: "e.g. dark synthpop with industrial textures",
  },
  {
    key: "releaseType",
    question: "What type of release is this?",
    placeholder: "e.g. 5-track EP",
  },
  {
    key: "audience",
    question: "Who is your target audience or ideal listener?",
    placeholder: "e.g. late-night listeners into The Weeknd, Health, Drab Majesty",
  },
  {
    key: "influences",
    question: "What artists, albums, or sounds have influenced this project?",
    placeholder: "e.g. Nine Inch Nails, Grimes, early Drake mixtapes",
  },
  {
    key: "visualDirection",
    question: "What visual or aesthetic direction are you imagining?",
    placeholder: "e.g. high-contrast black and white, glitch textures, neon accents",
  },
  {
    key: "timeline",
    question: "What's your target timeline for release?",
    placeholder: "e.g. ready to release in about 3 months",
  },
  {
    key: "goal",
    question: "What's your main goal for this release?",
    placeholder: "e.g. grow streaming numbers, build a local fanbase, land sync placements",
  },
  {
    key: "resources",
    question: "What resources do you have available?",
    placeholder: "e.g. small budget, DIY, no team yet",
  },
  {
    key: "concept",
    question: "Is there a theme, story, or concept tying this project together?",
    placeholder: "e.g. a breakup told across the EP's five tracks",
  },
  {
    key: "challenges",
    question: "What's the biggest challenge or unknown you're facing right now?",
    placeholder: "e.g. not sure how to get attention without a big following",
  },
] as const;

export function OracleQuestionnaire({
  vaultProjects,
  onComplete,
  onCancel,
}: {
  vaultProjects: VaultProject[];
  onComplete: (input: {
    projectName: string;
    answers: { question: string; answer: string }[];
  }) => Promise<{ ok: boolean; error?: string }>;
  onCancel: () => void;
}) {
  const [step, setStep] = useState(0); // 0 = basics, 1..N = questions, N+1 = review
  const [source, setSource] = useState(CUSTOM_OPTION);
  const [projectName, setProjectName] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = QUESTIONS.length + 2; // basics + questions + review
  const isBasicsStep = step === 0;
  const isReviewStep = step === QUESTIONS.length + 1;
  const currentQuestion = !isBasicsStep && !isReviewStep ? QUESTIONS[step - 1] : null;

  function handleSourceChange(value: string) {
    setSource(value);
    if (value === CUSTOM_OPTION) {
      setProjectName("");
      return;
    }
    const vaultProject = vaultProjects.find((v) => v.id === value);
    if (vaultProject) {
      setProjectName(vaultProject.title);
      setAnswers((prev) => ({
        ...prev,
        genre: prev.genre || vaultProject.description || `A ${vaultProject.type} project.`,
      }));
    }
  }

  function goNext() {
    setError(null);
    if (isBasicsStep && !projectName.trim()) {
      setError("Give your project a name first.");
      return;
    }
    if (currentQuestion && !answers[currentQuestion.key]?.trim()) {
      setError("Please answer this question before continuing.");
      return;
    }
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  const allAnswered = QUESTIONS.every((q) => answers[q.key]?.trim());

  async function handleSubmit() {
    if (!allAnswered) {
      setError("Please go back and answer every question before generating a roadmap.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await onComplete({
      projectName,
      answers: QUESTIONS.map((q) => ({
        question: q.question,
        answer: answers[q.key]!.trim(),
      })),
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Could not generate roadmap.");
    }
  }

  return (
    <div className="etched-glass rounded-xl p-8 space-y-6">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
              i <= step ? "bg-primary" : "bg-outline-variant/30"
            }`}
          />
        ))}
      </div>

      {isBasicsStep && (
        <div key={step} className="space-y-4 animate-fade-up">
          <h3 className="font-headline-sm text-headline-sm text-primary">
            Let&apos;s start with the basics
          </h3>
          {vaultProjects.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                Base on a library item
              </label>
              <select
                value={source}
                onChange={(e) => handleSourceChange(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
              >
                <option value={CUSTOM_OPTION}>Custom project…</option>
                {vaultProjects.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title} ({v.type})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
              Project name
            </label>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. The Nocturnal EP"
              className="w-full bg-surface-container-low border border-outline-variant rounded px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      )}

      {currentQuestion && (
        <div key={step} className="space-y-4 animate-fade-up">
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
            Question {step} of {QUESTIONS.length}
          </p>
          <h3 className="font-headline-sm text-headline-sm text-primary">
            {currentQuestion.question}
          </h3>
          <textarea
            value={answers[currentQuestion.key] ?? ""}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [currentQuestion.key]: e.target.value }))
            }
            placeholder={currentQuestion.placeholder}
            rows={3}
            autoFocus
            className="w-full bg-surface-container-low border border-outline-variant rounded px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>
      )}

      {isReviewStep && (
        <div className="space-y-4 animate-fade-up">
          <h3 className="font-headline-sm text-headline-sm text-primary">Review your answers</h3>
          <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
            {QUESTIONS.map((q) => (
              <div key={q.key} className="border-b border-outline-variant/30 pb-3">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">
                  {q.question}
                </p>
                <p className="font-body-md text-body-md text-on-surface">
                  {answers[q.key]?.trim() || (
                    <span className="italic text-error opacity-80">Not answered yet.</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-error text-sm">{error}</p>}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={isBasicsStep ? onCancel : goBack}
          className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors"
        >
          {isBasicsStep ? "Cancel" : "Back"}
        </button>
        {isReviewStep ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !allAnswered}
            className="px-6 py-3 border border-primary/50 rounded-full font-label-sm text-label-sm text-primary hover:bg-primary/10 transition-all duration-300 disabled:opacity-50 press-scale"
          >
            {submitting ? "The AI Strategist is drafting…" : "Generate Roadmap"}
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={
              (isBasicsStep && !projectName.trim()) ||
              (!!currentQuestion && !answers[currentQuestion.key]?.trim())
            }
            className="px-6 py-3 border border-primary/50 rounded-full font-label-sm text-label-sm text-primary hover:bg-primary/10 transition-all duration-300 disabled:opacity-50 press-scale"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
