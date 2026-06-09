"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

type BookedSession = {
  id: string;
  scheduledAt: string | Date;
  durationMins: number;
  notes: string | null;
  status: string;
  sessionIndex?: number | null;
  assessmentId?: string | null;
  patientReminderSentAt?: string | Date | null;
  doctorReminderSentAt?: string | Date | null;
};

interface BookSessionFormProps {
  patientId: string;
  onBooked: (session: BookedSession) => void;
}

export function BookSessionForm({ patientId, onBooked }: BookSessionFormProps) {
  const [scheduledAt, setScheduledAt] = useState("");
  const [durationMins, setDurationMins] = useState(60);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/portal/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMins,
        notes: notes || undefined,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Failed to book session");
      return;
    }

    const data = (await res.json()) as { session: BookedSession };
    onBooked(data.session);
    setScheduledAt("");
    setNotes("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-sky-200/60 bg-white p-5 shadow-sm"
    >
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-sky-900">
            Date & time
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            required
            className="w-full rounded-xl border border-sky-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-sky-900">
            Duration (minutes)
          </label>
          <input
            type="number"
            min={15}
            step={15}
            value={durationMins}
            onChange={(e) => setDurationMins(Number(e.target.value))}
            className="w-full rounded-xl border border-sky-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-sky-900">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-sky-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
          />
        </div>
        <Button type="submit" disabled={loading} fullWidth>
          {loading ? "Booking…" : "Book session"}
        </Button>
        <p className="text-xs text-sky-600">
          Patient and doctor receive reminders 24 hours before. Invoice emails
          send automatically 12 hours before.
        </p>
      </div>
    </form>
  );
}
