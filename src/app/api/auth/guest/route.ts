import { NextResponse } from "next/server";
import { createGuestUser } from "@/lib/auth";

export async function POST() {
  await createGuestUser();
  return NextResponse.json({ ok: true });
}
