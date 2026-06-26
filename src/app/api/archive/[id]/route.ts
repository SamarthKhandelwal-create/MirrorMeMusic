import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { id } = await ctx.params;

  const project = await prisma.archiveProject.findFirst({ where: { id, userId } });
  if (!project) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.archiveProject.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
