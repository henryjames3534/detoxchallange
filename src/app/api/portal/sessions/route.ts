import { NextResponse } from "next/server";
import { requireDoctor } from "@/lib/portal-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const doctor = await requireDoctor();
  if (!doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await prisma.session.findMany({
    orderBy: { scheduledAt: "asc" },
    include: {
      patient: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });

  return NextResponse.json({ sessions });
}

export async function POST(request: Request) {
  const doctor = await requireDoctor();
  if (!doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    patientId?: string;
    scheduledAt?: string;
    durationMins?: number;
    notes?: string;
  };

  if (!body.patientId || !body.scheduledAt) {
    return NextResponse.json(
      { error: "patientId and scheduledAt are required" },
      { status: 400 },
    );
  }

  const session = await prisma.session.create({
    data: {
      patientId: body.patientId,
      scheduledAt: new Date(body.scheduledAt),
      durationMins: body.durationMins ?? 60,
      notes: body.notes ?? null,
    },
    include: {
      patient: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });

  return NextResponse.json({ session });
}
