import { NextResponse } from "next/server";
import { requireDoctor } from "@/lib/portal-auth";
import { prisma } from "@/lib/db";
import {
  buildAssessmentReminderEmail,
  sendEmail,
} from "@/lib/email";
import { generateSessionsForAssessment } from "@/lib/portal-service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const doctor = await requireDoctor();
  if (!doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      assessments: { orderBy: { completedAt: "desc" } },
      sessions: { orderBy: { scheduledAt: "asc" } },
      invoices: { orderBy: { issuedAt: "desc" } },
    },
  });

  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  return NextResponse.json({
    patient: {
      ...patient,
      assessments: patient.assessments.map((a) => ({
        ...a,
        results: JSON.parse(a.resultsJson),
      })),
    },
  });
}

export async function POST(request: Request, context: RouteContext) {
  const doctor = await requireDoctor();
  if (!doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    action?: string;
    assessmentId?: string;
  };

  const patient = await prisma.patient.findUnique({ where: { id } });
  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  if (body.action === "generate-sessions") {
    if (!body.assessmentId) {
      return NextResponse.json(
        { error: "assessmentId is required" },
        { status: 400 },
      );
    }

    const assessment = await prisma.assessment.findFirst({
      where: { id: body.assessmentId, patientId: id },
    });
    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 },
      );
    }

    const result = await generateSessionsForAssessment(assessment.id);
    return NextResponse.json({ ok: true, ...result });
  }

  if (body.action !== "reminder") {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const name = `${patient.firstName} ${patient.lastName}`;
  const { subject, html, text } = buildAssessmentReminderEmail(name);
  const result = await sendEmail({
    to: patient.email,
    subject,
    html,
    text,
  });

  const latest = await prisma.assessment.findFirst({
    where: { patientId: id },
    orderBy: { completedAt: "desc" },
  });

  if (latest) {
    await prisma.assessment.update({
      where: { id: latest.id },
      data: { followUpSentAt: new Date() },
    });
  }

  return NextResponse.json({ ok: true, dev: result.dev });
}
