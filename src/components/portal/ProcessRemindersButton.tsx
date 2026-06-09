"use client";

import { useState } from "react";

export function ProcessRemindersButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function run() {
    setLoading(true);
    setResult("");
    const res = await fetch("/api/portal/reminders", { method: "POST" });
    setLoading(false);
    if (res.ok) {
      const data = (await res.json()) as {
        patientReminders: number;
        doctorReminders: number;
        invoicesSent: number;
        invoicesCreated: number;
      };
      setResult(
        `Patient reminders: ${data.patientReminders}, doctor: ${data.doctorReminders}, invoices sent: ${data.invoicesSent}`,
      );
    } else {
      setResult("Failed to process reminders");
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="rounded-lg border border-sky-200 px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50 disabled:opacity-50"
      >
        {loading ? "Processing…" : "Run session automation now"}
      </button>
      {result && <p className="mt-2 text-sm text-teal-700">{result}</p>}
    </div>
  );
}
