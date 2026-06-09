"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDateTime, patientName } from "@/lib/portal-format";
import {
  EditSessionDate,
  SessionAutomationStatus,
} from "@/components/portal/EditSessionDate";
import { cn } from "@/lib/utils";

type Session = {
  id: string;
  scheduledAt: string | Date;
  durationMins: number;
  notes: string | null;
  status: string;
  sessionIndex: number | null;
  patientReminderSentAt: string | Date | null;
  doctorReminderSentAt: string | Date | null;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

interface SessionsListClientProps {
  sessions: Session[];
}

export function SessionsListClient({ sessions }: SessionsListClientProps) {
  const router = useRouter();

  if (sessions.length === 0) {
    return <p className="text-sm text-sky-700">No sessions in this list.</p>;
  }

  return (
    <ul className="space-y-3">
      {sessions.map((s) => (
        <SessionItem
          key={s.id}
          session={s}
          onChanged={() => router.refresh()}
        />
      ))}
    </ul>
  );
}

function SessionItem({
  session: initialSession,
  onChanged,
}: {
  session: Session;
  onChanged: () => void;
}) {
  const [session, setSession] = useState(initialSession);
  const [loading, setLoading] = useState(false);
  const isCancelled = session.status === "cancelled";

  async function cancelSession() {
    if (!confirm("Cancel this session?")) return;
    setLoading(true);
    await fetch(`/api/portal/sessions/${session.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    setLoading(false);
    onChanged();
  }

  function handleUpdate(updated: Partial<Session> & { id: string; scheduledAt: string | Date }) {
    setSession((prev) => ({ ...prev, ...updated }));
    onChanged();
  }

  return (
    <li
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 rounded-xl border p-4",
        isCancelled
          ? "border-sky-100 bg-sky-50/50 opacity-70"
          : "border-sky-200/60 bg-white shadow-sm",
      )}
    >
      <div>
        <Link
          href={`/portal/patients/${session.patient.id}`}
          className="font-medium text-[#1e3a5f] hover:text-teal-700"
        >
          {patientName(session.patient.firstName, session.patient.lastName)}
        </Link>
        <p className="text-sm text-sky-700">{session.patient.email}</p>
        {session.sessionIndex && (
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Session {session.sessionIndex}
          </p>
        )}
        <EditSessionDate session={session} onUpdate={handleUpdate} />
        <p className="text-sm text-sky-600">{session.durationMins} min</p>
        {session.notes && (
          <p className="mt-1 text-sm text-sky-600">{session.notes}</p>
        )}
        <p className="mt-1 text-xs capitalize text-sky-500">{session.status}</p>
        <SessionAutomationStatus session={session} />
      </div>
      {!isCancelled && new Date(session.scheduledAt) >= new Date() && (
        <button
          type="button"
          onClick={cancelSession}
          disabled={loading}
          className="text-sm font-medium text-red-600 hover:text-red-800"
        >
          Cancel
        </button>
      )}
    </li>
  );
}
