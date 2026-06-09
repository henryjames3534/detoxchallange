"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface PatientReminderButtonProps {
  patientId: string;
}

export function PatientReminderButton({ patientId }: PatientReminderButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function sendReminder() {
    setLoading(true);
    setMessage("");

    const res = await fetch(`/api/portal/patients/${patientId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reminder" }),
    });

    setLoading(false);

    if (res.ok) {
      const data = (await res.json()) as { dev?: boolean };
      setMessage(data.dev ? "Logged (dev mode)" : "Sent!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("Failed");
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={sendReminder}
        disabled={loading}
        title="Send follow-up reminder email"
        className="inline-flex items-center gap-1 rounded-lg border border-sky-200 px-2.5 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-50 disabled:opacity-50"
      >
        <Send className="h-3 w-3" />
        {loading ? "…" : "Remind"}
      </button>
      {message && (
        <span className="absolute -top-6 left-0 whitespace-nowrap text-xs text-teal-600">
          {message}
        </span>
      )}
    </div>
  );
}
