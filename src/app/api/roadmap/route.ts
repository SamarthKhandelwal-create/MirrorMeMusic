import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const phases = await prisma.roadmapPhase.findMany({
    where: { userId },
    orderBy: [{ projectName: "asc" }, { phaseNumber: "asc" }],
  });

  return NextResponse.json({ phases });
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const projectName = typeof body?.projectName === "string" ? body.projectName.trim() : "";
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!projectName || !title) {
    return NextResponse.json({ error: "projectName and title are required" }, { status: 400 });
  }

  const phase = await prisma.roadmapPhase.create({
    data: {
      userId,
      projectName,
      phaseNumber: typeof body?.phaseNumber === "number" ? body.phaseNumber : 1,
      title,
      description: typeof body?.description === "string" ? body.description : "",
      status: typeof body?.status === "string" ? body.status : "locked",
      alignmentPercent: typeof body?.alignmentPercent === "number" ? body.alignmentPercent : 0,
      tags: typeof body?.tags === "string" ? body.tags : "",
    },
  });

  return NextResponse.json({ phase });
}
