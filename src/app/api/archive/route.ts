import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const projects = await prisma.archiveProject.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const project = await prisma.archiveProject.create({
    data: {
      userId,
      title,
      type: typeof body?.type === "string" ? body.type : "Release",
      description: typeof body?.description === "string" ? body.description : "",
      coverImageUrl: typeof body?.coverImageUrl === "string" ? body.coverImageUrl : "",
    },
  });

  return NextResponse.json({ project });
}
