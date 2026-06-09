"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookSessionForm } from "@/components/portal/BookSessionForm";

interface QuickBookClientProps {
  patients: { id: string; firstName: string; lastName: string }[];
}

export function QuickBookClient({ patients }: QuickBookClientProps) {
  const router = useRouter();
  const [patientId, setPatientId] = useState(patients[0]?.id ?? "");

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-sky-900">
          Patient
        </label>
        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full rounded-xl border border-sky-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>
      </div>
      {patientId && (
        <BookSessionForm
          patientId={patientId}
          onBooked={() => router.refresh()}
        />
      )}
    </div>
  );
}
