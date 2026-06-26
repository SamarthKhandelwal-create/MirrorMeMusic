import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { genAI, STRATEGIST_MODEL, STRATEGIST_SYSTEM_PROMPT } from "@/lib/gemini";
import { requireUserId } from "@/lib/auth";
import type { ChatSession, ChatMessage } from "@/generated/prisma/client";

function deriveTitle(message: string) {
  const trimmed = message.trim().replace(/\s+/g, " ");
  return trimmed.length > 48 ? `${trimmed.slice(0, 48)}…` : trimmed || "Untitled Session";
}

export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const sessions = await prisma.chatSession.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return NextResponse.json({
    sessions: sessions.map((s: ChatSession & { messages: ChatMessage[] }) => ({
      id: s.id,
      title: s.title,
      tags: s.tags,
      updatedAt: s.updatedAt,
      lastMessage: s.messages[0]?.content ?? "",
    })),
  });
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  let sessionId = typeof body?.sessionId === "string" ? body.sessionId : null;

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  let session = sessionId
    ? await prisma.chatSession.findFirst({ where: { id: sessionId, userId } })
    : null;

  if (!session) {
    session = await prisma.chatSession.create({
      data: { userId, title: deriveTitle(message) },
    });
  }
  sessionId = session.id;

  await prisma.chatMessage.create({
    data: { sessionId, role: "user", content: message },
  });

  const history = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  });

  const contents = history.map((m: ChatMessage) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  let replyText: string;
  try {
    const response = await genAI.models.generateContent({
      model: STRATEGIST_MODEL,
      contents,
      config: { systemInstruction: STRATEGIST_SYSTEM_PROMPT },
    });
    replyText = response.text ?? "The AI Strategist is silent. Try again.";
  } catch (err) {
    console.error("Gemini request failed", err);
    return NextResponse.json(
      { error: "The AI Strategist could not be reached. Please try again." },
      { status: 502 }
    );
  }

  await prisma.chatMessage.create({
    data: { sessionId, role: "assistant", content: replyText },
  });
  await prisma.chatSession.update({ where: { id: sessionId }, data: { updatedAt: new Date() } });

  return NextResponse.json({ sessionId, reply: replyText });
}
