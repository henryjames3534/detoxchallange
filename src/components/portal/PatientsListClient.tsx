"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Mail, Search, X } from "lucide-react";
import { formatDateTime, patientName } from "@/lib/portal-format";
import { PatientReminderButton } from "@/components/portal/PatientReminderButton";

export type PatientRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  updatedAt: string;
  assessmentCount: number;
  sessionCount: number;
  latest: {
    toxicLevelLabel: string;
    packageNumber: number;
    grandTotal: number;
    maxTotal: number;
    completedAt: string;
  } | null;
};

interface PatientsListClientProps {
  patients: PatientRow[];
}

function matchesPatientSearch(patient: PatientRow, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const fullName = patientName(patient.firstName, patient.lastName).toLowerCase();
  const reverseName = patientName(patient.lastName, patient.firstName).toLowerCase();

  return (
    fullName.includes(q) ||
    reverseName.includes(q) ||
    patient.firstName.toLowerCase().includes(q) ||
    patient.lastName.toLowerCase().includes(q) ||
    patient.email.toLowerCase().includes(q) ||
    (patient.phone?.toLowerCase().includes(q) ?? false)
  );
}

export function PatientsListClient({ patients }: PatientsListClientProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => patients.filter((p) => matchesPatientSearch(p, search)),
    [patients, search],
  );

  if (patients.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-sky-200 bg-white p-12 text-center">
        <p className="text-sky-700">No patients yet.</p>
        <p className="mt-2 text-sm text-sky-600">
          Records appear here when someone completes the detox challenge.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name, email, or phone…"
            className="w-full rounded-xl border border-sky-200 bg-white py-2.5 pl-10 pr-10 text-sm text-[#1e3a5f] outline-none placeholder:text-sky-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            aria-label="Search patients"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-sky-500 hover:bg-sky-50 hover:text-sky-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="text-sm text-sky-600">
          {filtered.length} of {patients.length} patient
          {patients.length === 1 ? "" : "s"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sky-200 bg-white p-10 text-center">
          <p className="text-sky-700">No patients match &ldquo;{search}&rdquo;</p>
          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-3 text-sm font-medium text-teal-700 hover:text-teal-900"
          >
            Clear search
          </button>
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
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-sky-50/40">
                    <td className="px-4 py-4">
                      <Link
                        href={`/portal/patients/${p.id}`}
                        className="font-medium text-[#1e3a5f] hover:text-teal-700"
                      >
                        {patientName(p.firstName, p.lastName)}
                      </Link>
                      {p.assessmentCount > 1 && (
                        <p className="text-xs text-sky-600">
                          {p.assessmentCount} assessments
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
                      {p.latest ? (
                        <div>
                          <p className="font-medium text-teal-700">
                            {p.latest.toxicLevelLabel}
                          </p>
                          <p className="text-xs text-sky-600">
                            Package {p.latest.packageNumber} · {p.latest.grandTotal}/
                            {p.latest.maxTotal} pts
                          </p>
                          <p className="text-xs text-sky-500">
                            {formatDateTime(p.latest.completedAt)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sky-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sky-700">
                      {formatDateTime(p.updatedAt)}
                    </td>
                    <td className="px-4 py-4 text-sky-700">{p.sessionCount}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
