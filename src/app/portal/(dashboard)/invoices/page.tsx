import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate, formatDateTime, patientName } from "@/lib/portal-format";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { issuedAt: "desc" },
    include: {
      patient: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Invoices</h1>
        <p className="mt-1 text-sm text-sky-700">
          Create and print invoices for patients. Open a patient record to generate a
          new invoice.
        </p>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sky-200 bg-white p-12 text-center">
          <p className="text-sky-700">No invoices yet.</p>
          <p className="mt-2 text-sm text-sky-600">
            Go to a patient profile to create an invoice.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-sky-200/60 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-sky-100 bg-sky-50/80 text-xs uppercase tracking-wide text-sky-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Invoice #</th>
                  <th className="px-4 py-3 font-semibold">Patient</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Issued</th>
                  <th className="px-4 py-3 font-semibold">Due</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-sky-50/40">
                    <td className="px-4 py-4 font-medium text-[#1e3a5f]">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/portal/patients/${inv.patient.id}`}
                        className="text-teal-700 hover:text-teal-900"
                      >
                        {patientName(inv.patient.firstName, inv.patient.lastName)}
                      </Link>
                      <p className="text-xs text-sky-600">{inv.patient.email}</p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-teal-700">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="px-4 py-4 capitalize">{inv.status}</td>
                    <td className="px-4 py-4 text-sky-700">
                      {formatDateTime(inv.issuedAt)}
                    </td>
                    <td className="px-4 py-4 text-sky-700">
                      {inv.dueAt ? formatDate(inv.dueAt) : "—"}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/portal/invoices/${inv.id}/print`}
                        target="_blank"
                        className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
                      >
                        Print
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
