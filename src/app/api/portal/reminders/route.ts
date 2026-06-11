import { NextResponse } from "next/server";
import { requireDoctor } from "@/lib/portal-auth";
import { processSessionAutomation } from "@/lib/portal-service";
import { env } from "@/lib/env";

function isCronAuthorized(request: Request) {
  const secret = env("CRON_SECRET");
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

async function handleAutomation(request: Request) {
  const doctor = await requireDoctor();
  if (!doctor && !isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await processSessionAutomation();
  return NextResponse.json(result);
}

/** Vercel Cron invokes this path with HTTP GET. */
export async function GET(request: Request) {
  return handleAutomation(request);
}

export async function POST(request: Request) {
  return handleAutomation(request);
}
