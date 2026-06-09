"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/portal-format";

export type EditableSession = {
  id: string;
  scheduledAt: string | Date;
  durationMins?: number;
  notes?: string | null;
  status?: string;
  sessionIndex?: number | null;
  assessmentId?: string | null;
  patientReminderSentAt?: string | Date | null;
  doctorReminderSentAt?: string | Date | null;
};

function toLocalInputValue(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface EditSessionDateProps {
  session: EditableSession;
  onUpdate: (session: EditableSession) => void;
}

export function EditSessionDate({ session, onUpdate }: EditSessionDateProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(toLocalInputValue(session.scheduledAt));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/portal/sessions/${session.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledAt: new Date(value).toISOString() }),
    });
    setLoading(false);

    if (!res.ok) {
      setError("Failed to update");
      return;
    }

    const data = (await res.json()) as { session: EditableSession };
    onUpdate(data.session);
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setValue(toLocalInputValue(session.scheduledAt));
          setEditing(true);
        }}
        className="text-left font-medium text-[#1e3a5f] hover:text-teal-700"
        title="Click to edit date & time"
      >
        {formatDateTime(session.scheduledAt)}
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={save}
          disabled={loading}
          className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-lg border border-sky-200 px-3 py-1.5 text-xs font-medium text-sky-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function SessionAutomationStatus({ session }: { session: EditableSession }) {
  return (
    <div className="mt-1 space-y-0.5 text-xs text-sky-600">
      {session.patientReminderSentAt && (
        <p className="text-teal-600">
          Patient reminder sent {formatDateTime(session.patientReminderSentAt)}
        </p>
      )}
      {session.doctorReminderSentAt && (
        <p className="text-teal-600">
          Doctor reminder sent {formatDateTime(session.doctorReminderSentAt)}
        </p>
      )}
    </div>
  );
}
