import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireDoctor } from "@/lib/portal-auth";
import { patientName } from "@/lib/portal-format";
import type { ChallengeResults } from "@/lib/types";
import { AssessmentResultsView } from "@/components/portal/AssessmentResultsView";

type PageProps = {
  params: Promise<{ id: string; assessmentId: string }>;
};

export default async function PortalAssessmentResultsPage({ params }: PageProps) {
  const doctor = await requireDoctor();
  if (!doctor) notFound();

  const { id: patientId, assessmentId } = await params;

  const assessment = await prisma.assessment.findFirst({
    where: { id: assessmentId, patientId },
    include: {
      patient: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
  });

  if (!assessment) notFound();

  const results = JSON.parse(assessment.resultsJson) as ChallengeResults;
  const name = patientName(
    assessment.patient.firstName,
    assessment.patient.lastName,
  );

  return (
    <div>
      <div className="mb-6 print:hidden">
        <Link
          href={`/portal/patients/${patientId}`}
          className="text-sm font-medium text-teal-700 hover:text-teal-900"
        >
          ← Back to patient record
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-[#1e3a5f]">
          Assessment results — {name}
        </h1>
      </div>

      <AssessmentResultsView
        results={results}
        patientId={patientId}
        patientName={name}
        packageNumber={assessment.packageNumber}
        packageSessions={assessment.packageSessions}
      />
    </div>
  );
}
