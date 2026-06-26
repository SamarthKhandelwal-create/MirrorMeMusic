import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";
import { genAI, STRATEGIST_MODEL } from "@/lib/gemini";

const GENERATE_PROMPT = `You are the AI Strategist for MirrorMeMusic, helping independent musicians plan their releases. Given a project name and the artist's answers to a strategy questionnaire, draft exactly 4 release-strategy phases.

Respond with ONLY valid JSON (no markdown fences) matching this shape:
{
  "phases": [
    { "title": string, "description": string, "tags": string[] }
  ]
}

The 4 phases must be, in order: songwriting & composition, branding & visual strategy, production & engineering, distribution & marketing. Keep each description under 200 characters, and make every phase specific to the artist's actual answers (genre, influences, goals, timeline, etc.) rather than generic advice.`;

type QAPair = { question: string; answer: string };

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const projectName = typeof body?.projectName === "string" ? body.projectName.trim() : "";
  const answers: QAPair[] = Array.isArray(body?.answers)
    ? body.answers.filter(
        (a: unknown): a is QAPair =>
          typeof a === "object" &&
          a !== null &&
          typeof (a as QAPair).question === "string" &&
          typeof (a as QAPair).answer === "string"
      )
    : [];
  if (!projectName) {
    return NextResponse.json({ error: "projectName is required" }, { status: 400 });
  }

  const REQUIRED_ANSWER_COUNT = 10;
  const answeredCount = answers.filter((a) => a.answer.trim().length > 0).length;
  if (answeredCount < REQUIRED_ANSWER_COUNT) {
    return NextResponse.json(
      { error: "All questionnaire questions must be answered." },
      { status: 400 }
    );
  }

  const questionnaireSummary = answers.length
    ? answers.map((a) => `Q: ${a.question}\nA: ${a.answer}`).join("\n\n")
    : "No questionnaire answers provided.";

  let parsed: { phases: { title: string; description: string; tags: string[] }[] };
  try {
    const response = await genAI.models.generateContent({
      model: STRATEGIST_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Project: ${projectName}\n\nArtist questionnaire:\n${questionnaireSummary}`,
            },
          ],
        },
      ],
      config: { systemInstruction: GENERATE_PROMPT },
    });
    const text = (response.text ?? "").trim();
    const jsonText = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    parsed = JSON.parse(jsonText);
    if (!Array.isArray(parsed.phases) || parsed.phases.length === 0) {
      throw new Error("Malformed phases array");
    }
  } catch (err) {
    console.error("Gemini roadmap generation failed", err);
    return NextResponse.json(
      { error: "The AI Strategist could not draft a roadmap. Please try again." },
      { status: 502 }
    );
  }

  await prisma.roadmapPhase.deleteMany({ where: { userId, projectName } });

  const created = await Promise.all(
    parsed.phases.slice(0, 4).map((phase, index) =>
      prisma.roadmapPhase.create({
        data: {
          userId,
          projectName,
          phaseNumber: index + 1,
          title: phase.title,
          description: phase.description,
          status: index === 0 ? "in_progress" : "locked",
          alignmentPercent: index === 0 ? 10 : 0,
          tags: Array.isArray(phase.tags) ? phase.tags.join(",") : "",
        },
      })
    )
  );

  return NextResponse.json({ phases: created });
}
