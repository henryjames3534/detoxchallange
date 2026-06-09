import { NextResponse } from "next/server";
import { requireDoctor } from "@/lib/portal-auth";
import { processSessionAutomation } from "@/lib/portal-service";

function isCronAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  const doctor = await requireDoctor();
  if (!doctor && !isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await processSessionAutomation();
  return NextResponse.json(result);
}
