"use client";

import { useState } from "react";
import Link from "next/link";
import { PatientReminderButton } from "@/components/portal/PatientReminderButton";
import { BookSessionForm } from "@/components/portal/BookSessionForm";
import { CreateInvoiceForm } from "@/components/portal/CreateInvoiceForm";
import { GeneratePackageSessionsButton } from "@/components/portal/GeneratePackageSessionsButton";
import {
  EditSessionDate,
  SessionAutomationStatus,
} from "@/components/portal/EditSessionDate";
import { formatCurrency, formatDateTime } from "@/lib/portal-format";
import { cn } from "@/lib/utils";

type Assessment = {
  id: string;
  grandTotal: number;
  maxTotal: number;
  toxicLevelPercent: number;
  toxicLevelLabel: string;
  packageNumber: number;
  packageSessions: number;
  completedAt: string | Date;
  followUpSentAt: string | Date | null;
  scheduledSessionCount: number;
  results: Record<string, unknown>;
};

type Session = {
  id: string;
  scheduledAt: string | Date;
  durationMins: number;
  notes: string | null;
  status: string;
  sessionIndex: number | null;
  assessmentId: string | null;
  patientReminderSentAt: string | Date | null;
  doctorReminderSentAt: string | Date | null;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  amount: number;
  description: string;
  status: string;
  issuedAt: string | Date;
  dueAt: string | Date | null;
};

const TABS = ["Assessments", "Sessions", "Invoices"] as const;

interface PatientDetailTabsProps {
  patientId: string;
  patientName: string;
  assessments: Assessment[];
  sessions: Session[];
  invoices: Invoice[];
}

export function PatientDetailTabs({
  patientId,
  patientName,
  assessments,
  sessions,
  invoices,
}: PatientDetailTabsProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Assessments");
  const [sessionList, setSessionList] = useState(sessions);
  const [invoiceList, setInvoiceList] = useState(invoices);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-sky-200">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "border-b-2 px-4 py-3 text-sm font-medium transition",
              tab === t
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-sky-600 hover:text-teal-700",
            )}
          >
            {t}
            {t === "Sessions" && ` (${sessionList.length})`}
            {t === "Invoices" && ` (${invoiceList.length})`}
          </button>
        ))}
        <div className="ml-auto pb-3">
          <PatientReminderButton patientId={patientId} />
        </div>
      </div>

      {tab === "Assessments" && (
        <div className="space-y-4">
          {assessments.length === 0 ? (
            <p className="text-sky-700">No assessments recorded.</p>
          ) : (
            assessments.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-sky-200/60 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-[#1e3a5f]">
                      {a.toxicLevelLabel}
                    </p>
                    <p className="text-sm text-sky-700">
                      Score: {a.grandTotal}/{a.maxTotal} (
                      {Number(a.toxicLevelPercent).toFixed(1)}%)
                    </p>
                    <p className="text-sm text-sky-700">
                      Recommended Package {a.packageNumber} — {a.packageSessions}{" "}
                      sessions
                    </p>
                    <p className="mt-1 text-xs text-sky-500">
                      Completed {formatDateTime(a.completedAt)}
                    </p>
                    {a.followUpSentAt && (
                      <p className="text-xs text-teal-600">
                        Reminder sent {formatDateTime(a.followUpSentAt)}
                      </p>
                    )}
                    {a.scheduledSessionCount > 0 ? (
                      <p className="mt-2 text-xs text-teal-700">
                        {a.scheduledSessionCount} weekly session
                        {a.scheduledSessionCount === 1 ? "" : "s"} scheduled
                      </p>
                    ) : (
                      <div className="mt-3">
                        <GeneratePackageSessionsButton
                          patientId={patientId}
                          assessmentId={a.id}
                          sessionCount={a.packageSessions}
                        />
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/portal/patients/${patientId}/results/${a.id}`}
                    className="shrink-0 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
                  >
                    View complete result
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "Sessions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-[#1e3a5f]">
              Book session
            </h2>
            <BookSessionForm
              patientId={patientId}
              onBooked={(session) =>
                setSessionList((prev) =>
                  [
                    ...prev,
                    {
                      ...session,
                      sessionIndex: session.sessionIndex ?? null,
                      assessmentId: session.assessmentId ?? null,
                      patientReminderSentAt: session.patientReminderSentAt ?? null,
                      doctorReminderSentAt: session.doctorReminderSentAt ?? null,
                    },
                  ].sort(
                    (a, b) =>
                      new Date(a.scheduledAt).getTime() -
                      new Date(b.scheduledAt).getTime(),
                  ),
                )
              }
            />
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold text-[#1e3a5f]">
              Scheduled sessions
            </h2>
            <p className="mb-4 text-xs text-sky-600">
              Click any date to edit. Reminders and invoices reset when you
              reschedule.
            </p>
            {sessionList.length === 0 ? (
              <p className="text-sm text-sky-700">No sessions booked yet.</p>
            ) : (
              <ul className="space-y-3">
                {sessionList.map((s) => (
                  <SessionRow
                    key={s.id}
                    session={s}
                    onUpdate={(updated) =>
                      setSessionList((prev) =>
                        prev.map((x) => (x.id === updated.id ? updated : x)),
                      )
                    }
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {tab === "Invoices" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-[#1e3a5f]">
              Create invoice
            </h2>
            <CreateInvoiceForm
              patientId={patientId}
              defaultDescription={`AcuActiv detox treatment — ${patientName}`}
              onCreated={(invoice) => setInvoiceList((prev) => [invoice, ...prev])}
            />
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold text-[#1e3a5f]">Invoices</h2>
            {invoiceList.length === 0 ? (
              <p className="text-sm text-sky-700">No invoices yet.</p>
            ) : (
              <ul className="space-y-3">
                {invoiceList.map((inv) => (
                  <li
                    key={inv.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-200/60 bg-white p-4"
                  >
                    <div>
                      <p className="font-medium text-[#1e3a5f]">
                        {inv.invoiceNumber}
                      </p>
                      <p className="text-sm text-sky-700">{inv.description}</p>
                      <p className="text-sm font-semibold text-teal-700">
                        {formatCurrency(inv.amount)}
                      </p>
                      <p className="text-xs capitalize text-sky-500">{inv.status}</p>
                    </div>
                    <Link
                      href={`/portal/invoices/${inv.id}/print`}
                      target="_blank"
                      className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
                    >
                      Print
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SessionRow({
  session,
  onUpdate,
}: {
  session: Session;
  onUpdate: (s: Session) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function cancelSession() {
    if (!confirm("Cancel this session?")) return;
    setLoading(true);
    const res = await fetch(`/api/portal/sessions/${session.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    setLoading(false);
    if (res.ok) {
      const data = (await res.json()) as { session: Session };
      onUpdate(data.session);
    }
  }

  const isCancelled = session.status === "cancelled";

  return (
    <li
      className={cn(
        "rounded-xl border p-4",
        isCancelled
          ? "border-sky-100 bg-sky-50/50 opacity-60"
          : "border-sky-200/60 bg-white",
      )}
    >
      {session.sessionIndex && (
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          Session {session.sessionIndex}
        </p>
      )}
      <EditSessionDate
        session={session}
        onUpdate={(updated) => onUpdate({ ...session, ...updated })}
      />
      <p className="text-sm text-sky-700">{session.durationMins} minutes</p>
      {session.notes && (
        <p className="mt-1 text-sm text-sky-600">{session.notes}</p>
      )}
      <p className="mt-1 text-xs capitalize text-sky-500">{session.status}</p>
      <SessionAutomationStatus session={session} />
      {!isCancelled && (
        <button
          type="button"
          onClick={cancelSession}
          disabled={loading}
          className="mt-2 text-xs font-medium text-red-600 hover:text-red-800"
        >
          Cancel session
        </button>
      )}
    </li>
  );
}
