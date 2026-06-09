"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

type Invoice = {
  id: string;
  invoiceNumber: string;
  amount: number;
  description: string;
  status: string;
  issuedAt: string | Date;
  dueAt: string | Date | null;
};

interface CreateInvoiceFormProps {
  patientId: string;
  defaultDescription?: string;
  onCreated: (invoice: Invoice) => void;
}

export function CreateInvoiceForm({
  patientId,
  defaultDescription = "",
  onCreated,
}: CreateInvoiceFormProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState(defaultDescription);
  const [dueAt, setDueAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/portal/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId,
        amount: parseFloat(amount),
        description,
        dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Failed to create invoice");
      return;
    }

    const data = (await res.json()) as { invoice: Invoice };
    onCreated(data.invoice);
    setAmount("");
    setDueAt("");
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
            Amount (USD)
          </label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full rounded-xl border border-sky-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-sky-900">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full rounded-xl border border-sky-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-sky-900">
            Due date (optional)
          </label>
          <input
            type="date"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className="w-full rounded-xl border border-sky-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
          />
        </div>
        <Button type="submit" disabled={loading} fullWidth>
          {loading ? "Creating…" : "Create invoice"}
        </Button>
      </div>
    </form>
  );
}
