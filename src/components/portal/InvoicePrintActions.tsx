"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface InvoicePrintActionsProps {
  invoiceId: string;
  status: string;
}

export function InvoicePrintActions({ invoiceId, status }: InvoicePrintActionsProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState(false);

  async function markPaid() {
    setLoading(true);
    const res = await fetch(`/api/portal/invoices/${invoiceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid" }),
    });
    setLoading(false);
    if (res.ok) {
      setCurrentStatus("paid");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-3">
      <Link
        href="/portal/invoices"
        className="text-sm font-medium text-teal-700 hover:text-teal-900"
      >
        ← Back to invoices
      </Link>
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
      >
        Print / Save PDF
      </button>
      {currentStatus !== "paid" && (
        <button
          type="button"
          onClick={markPaid}
          disabled={loading}
          className="rounded-lg border border-teal-600 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50"
        >
          {loading ? "…" : "Mark as paid"}
        </button>
      )}
      {currentStatus === "paid" && (
        <span className="text-sm font-medium text-teal-700">Paid</span>
      )}
    </div>
  );
}
