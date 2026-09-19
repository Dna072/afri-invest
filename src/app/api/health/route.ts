import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Liveness for Cloud Run. Add ?ready=1 to also ping the database.
 */
export async function GET(request: NextRequest) {
  const ready = request.nextUrl.searchParams.get("ready") === "1";
  if (!ready) {
    return NextResponse.json({ ok: true, service: "africa-invest" });
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, service: "africa-invest", db: "up" });
  } catch {
    return NextResponse.json({ ok: false, service: "africa-invest", db: "down" }, { status: 503 });
  }
}
