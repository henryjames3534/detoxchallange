"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface GeneratePackageSessionsButtonProps {
  patientId: string;
  assessmentId: string;
  sessionCount: number;
  defaultDurationMins?: number;
}

export function GeneratePackageSessionsButton({
  patientId,
  assessmentId,
  sessionCount,
  defaultDurationMins = 60,
}: GeneratePackageSessionsButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [durationMins, setDurationMins] = useState(defaultDurationMins);

  async function generate() {
    setLoading(true);
    setMessage("");

    const res = await fetch(`/api/portal/patients/${patientId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generate-sessions",
        assessmentId,
        durationMins,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      setMessage("Failed to schedule appointments");
      return;
    }

    const data = (await res.json()) as { created: number; skipped?: boolean };
    if (data.skipped) {
      setMessage("Appointments already scheduled for this assessment");
    } else {
      setMessage(
        `Scheduled ${data.created} weekly appointments (${durationMins} min each)`,
      );
      router.refresh();
    }
  }

  return (
    <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4">
      <p className="text-sm font-medium text-teal-900">
        Auto-schedule {sessionCount} weekly appointments
      </p>
      <p className="mt-1 text-xs text-teal-800/80">
        First visit is one week after assessment, then weekly on your default
        day/time.
      </p>
      <div className="mt-3">
        <label className="mb-1 block text-xs font-medium text-teal-900">
          Duration per appointment (minutes)
        </label>
        <input
          type="number"
          min={15}
          max={480}
          step={15}
          value={durationMins}
          onChange={(e) => setDurationMins(Number(e.target.value))}
          className="w-full max-w-[140px] rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
        />
      </div>
      <button
        type="button"
        onClick={generate}
        disabled={loading || durationMins < 15}
        className="mt-3 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? "Scheduling…" : "Schedule appointments"}
      </button>
      {message && <p className="mt-2 text-xs text-teal-700">{message}</p>}
    </div>
  );
}
