import { NextResponse } from "next/server";
import { requireDoctor } from "@/lib/portal-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const doctor = await requireDoctor();
  if (!doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const patients = await prisma.patient.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      assessments: {
        orderBy: { completedAt: "desc" },
        take: 1,
      },
      _count: { select: { sessions: true, invoices: true, assessments: true } },
    },
  });

  return NextResponse.json({
    patients: patients.map((p) => ({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      phone: p.phone,
      dateOfBirth: p.dateOfBirth,
      updatedAt: p.updatedAt,
      assessmentCount: p._count.assessments,
      sessionCount: p._count.sessions,
      invoiceCount: p._count.invoices,
      latestAssessment: p.assessments[0] ?? null,
    })),
  });
}
