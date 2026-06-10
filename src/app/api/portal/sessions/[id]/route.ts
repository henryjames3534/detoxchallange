import { NextResponse } from "next/server";
import { requireDoctor } from "@/lib/portal-auth";
import { prisma } from "@/lib/db";
import { resetSessionAutomationOnReschedule } from "@/lib/portal-service";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const doctor = await requireDoctor();
  if (!doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    status?: string;
    scheduledAt?: string;
    notes?: string;
    durationMins?: number;
  };

  if (body.scheduledAt) {
    await resetSessionAutomationOnReschedule(id);
  }

  const durationMins =
    body.durationMins != null
      ? Math.min(Math.max(body.durationMins, 15), 480)
      : undefined;

  const session = await prisma.session.update({
    where: { id },
    data: {
      ...(body.status ? { status: body.status } : {}),
      ...(body.scheduledAt ? { scheduledAt: new Date(body.scheduledAt) } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
      ...(durationMins != null ? { durationMins } : {}),
    },
  });

  return NextResponse.json({ session });
}
