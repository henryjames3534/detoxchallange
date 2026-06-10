import { prisma } from "@/lib/db";
import {
  PatientsListClient,
  type PatientRow,
} from "@/components/portal/PatientsListClient";

export default async function PatientsPage() {
  const patients = await prisma.patient.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      assessments: { orderBy: { completedAt: "desc" }, take: 1 },
      _count: { select: { sessions: true, assessments: true } },
    },
  });

  const rows: PatientRow[] = patients.map((p) => {
    const latest = p.assessments[0];
    return {
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      phone: p.phone,
      updatedAt: p.updatedAt.toISOString(),
      assessmentCount: p._count.assessments,
      sessionCount: p._count.sessions,
      latest: latest
        ? {
            toxicLevelLabel: latest.toxicLevelLabel,
            packageNumber: latest.packageNumber,
            grandTotal: latest.grandTotal,
            maxTotal: latest.maxTotal,
            completedAt: latest.completedAt.toISOString(),
          }
        : null,
    };
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Patient Records</h1>
        <p className="mt-1 text-sm text-sky-700">
          Search by name, email, or phone. Sorted by most recent activity.
        </p>
      </div>

      <PatientsListClient patients={rows} />
    </div>
  );
}
