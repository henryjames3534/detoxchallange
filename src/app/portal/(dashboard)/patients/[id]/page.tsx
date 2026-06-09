import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireDoctor } from "@/lib/portal-auth";
import { formatDateTime, patientName } from "@/lib/portal-format";
import { PatientDetailTabs } from "@/components/portal/PatientDetailTabs";

type PageProps = { params: Promise<{ id: string }> };

export default async function PatientDetailPage({ params }: PageProps) {
  const { id } = await params;
  const doctor = await requireDoctor();
  if (!doctor) notFound();

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      assessments: { orderBy: { completedAt: "desc" } },
      sessions: { orderBy: { scheduledAt: "asc" } },
      invoices: { orderBy: { issuedAt: "desc" } },
    },
  });

  if (!patient) notFound();

  const assessments = patient.assessments.map((a) => ({
    ...a,
    results: JSON.parse(a.resultsJson) as Record<string, unknown>,
    scheduledSessionCount: patient.sessions.filter(
      (s) => s.assessmentId === a.id && s.status !== "cancelled",
    ).length,
  }));

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/portal/patients"
          className="text-sm font-medium text-teal-700 hover:text-teal-900"
        >
          ← Back to patients
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-[#1e3a5f]">
          {patientName(patient.firstName, patient.lastName)}
        </h1>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-sky-700">
          <span>{patient.email}</span>
          {patient.phone && <span>{patient.phone}</span>}
          {patient.dateOfBirth && <span>DOB: {patient.dateOfBirth}</span>}
          <span>Registered {formatDateTime(patient.createdAt)}</span>
        </div>
      </div>

      <PatientDetailTabs
        patientId={patient.id}
        patientName={patientName(patient.firstName, patient.lastName)}
        assessments={assessments}
        sessions={patient.sessions}
        invoices={patient.invoices}
      />
    </div>
  );
}
