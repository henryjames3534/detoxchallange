"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface GeneratePackageSessionsButtonProps {
  patientId: string;
  assessmentId: string;
  sessionCount: number;
}

export function GeneratePackageSessionsButton({
  patientId,
  assessmentId,
  sessionCount,
}: GeneratePackageSessionsButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function generate() {
    setLoading(true);
    setMessage("");

    const res = await fetch(`/api/portal/patients/${patientId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generate-sessions",
        assessmentId,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      setMessage("Failed to schedule sessions");
      return;
    }

    const data = (await res.json()) as { created: number; skipped?: boolean };
    if (data.skipped) {
      setMessage("Sessions already scheduled for this assessment");
    } else {
      setMessage(`Scheduled ${data.created} weekly sessions`);
      router.refresh();
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className="rounded-lg border border-teal-600 px-3 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50 disabled:opacity-50"
      >
        {loading
          ? "Scheduling…"
          : `Auto-schedule ${sessionCount} weekly sessions`}
      </button>
      {message && <p className="mt-2 text-xs text-teal-700">{message}</p>}
    </div>
  );
}
