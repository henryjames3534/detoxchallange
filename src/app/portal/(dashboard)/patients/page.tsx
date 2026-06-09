import Link from "next/link";
import { Mail, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDateTime, patientName } from "@/lib/portal-format";
import { PatientReminderButton } from "@/components/portal/PatientReminderButton";

export default async function PatientsPage() {
  const patients = await prisma.patient.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      assessments: { orderBy: { completedAt: "desc" }, take: 1 },
      _count: { select: { sessions: true, assessments: true } },
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Patient Records</h1>
        <p className="mt-1 text-sm text-sky-700">
          All detox challenge submissions, sorted by most recent activity
        </p>
      </div>

      {patients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sky-200 bg-white p-12 text-center">
          <p className="text-sky-700">No patients yet.</p>
          <p className="mt-2 text-sm text-sky-600">
            Records appear here when someone completes the detox challenge.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-sky-200/60 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-sky-100 bg-sky-50/80 text-xs uppercase tracking-wide text-sky-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Patient</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Latest result</th>
                  <th className="px-4 py-3 font-semibold">Last updated</th>
                  <th className="px-4 py-3 font-semibold">Sessions</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100">
                {patients.map((p) => {
                  const latest = p.assessments[0];
                  return (
                    <tr key={p.id} className="hover:bg-sky-50/40">
                      <td className="px-4 py-4">
                        <Link
                          href={`/portal/patients/${p.id}`}
                          className="font-medium text-[#1e3a5f] hover:text-teal-700"
                        >
                          {patientName(p.firstName, p.lastName)}
                        </Link>
                        {p._count.assessments > 1 && (
                          <p className="text-xs text-sky-600">
                            {p._count.assessments} assessments
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="flex items-center gap-1.5 text-sky-800">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          {p.email}
                        </p>
                        {p.phone && (
                          <p className="mt-1 text-xs text-sky-600">{p.phone}</p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {latest ? (
                          <div>
                            <p className="font-medium text-teal-700">
                              {latest.toxicLevelLabel}
                            </p>
                            <p className="text-xs text-sky-600">
                              Package {latest.packageNumber} · {latest.grandTotal}/
                              {latest.maxTotal} pts
                            </p>
                            <p className="text-xs text-sky-500">
                              {formatDateTime(latest.completedAt)}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sky-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sky-700">
                        {formatDateTime(p.updatedAt)}
                      </td>
                      <td className="px-4 py-4 text-sky-700">{p._count.sessions}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <PatientReminderButton patientId={p.id} />
                          <Link
                            href={`/portal/patients/${p.id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-900"
                          >
                            View
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
