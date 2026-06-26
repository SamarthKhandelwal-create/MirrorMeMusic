import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { id } = await ctx.params;

  const existing = await prisma.roadmapPhase.findFirst({ where: { id, userId } });
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const data: Record<string, string | number> = {};
  if (typeof body?.status === "string") data.status = body.status;
  if (typeof body?.title === "string") data.title = body.title;
  if (typeof body?.description === "string") data.description = body.description;
  if (typeof body?.alignmentPercent === "number") data.alignmentPercent = body.alignmentPercent;
  if (typeof body?.tags === "string") data.tags = body.tags;

  const phase = await prisma.roadmapPhase.update({ where: { id }, data });
  return NextResponse.json({ phase });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { id } = await ctx.params;

  const existing = await prisma.roadmapPhase.findFirst({ where: { id, userId } });
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.roadmapPhase.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
