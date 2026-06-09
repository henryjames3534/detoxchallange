import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireDoctor } from "@/lib/portal-auth";
import { formatCurrency, formatDate, patientName } from "@/lib/portal-format";
import { InvoicePrintActions } from "@/components/portal/InvoicePrintActions";

type PageProps = { params: Promise<{ id: string }> };

export default async function InvoicePrintPage({ params }: PageProps) {
  const { id } = await params;
  const doctor = await requireDoctor();
  if (!doctor) notFound();

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { patient: true },
  });

  if (!invoice) notFound();

  const items = invoice.itemsJson
    ? (JSON.parse(invoice.itemsJson) as { label: string; amount: number }[])
    : [{ label: invoice.description, amount: invoice.amount }];

  return (
    <div className="min-h-screen bg-white print:min-h-0">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>

      <div className="no-print border-b border-sky-200 bg-sky-50 px-4 py-3">
        <InvoicePrintActions invoiceId={invoice.id} status={invoice.status} />
      </div>

      <article className="mx-auto max-w-2xl px-6 py-10 print:px-0 print:py-0">
        <header className="mb-10 flex flex-wrap items-start justify-between gap-6 border-b border-sky-200 pb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">{doctor.clinicName}</h1>
            <p className="mt-1 text-sm text-sky-700">{doctor.name}</p>
            {doctor.email && (
              <p className="text-sm text-sky-600">{doctor.email}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
              Invoice
            </p>
            <p className="text-xl font-bold text-[#1e3a5f]">
              {invoice.invoiceNumber}
            </p>
            <p className="mt-2 text-sm text-sky-700">
              Issued: {formatDate(invoice.issuedAt)}
            </p>
            {invoice.dueAt && (
              <p className="text-sm text-sky-700">
                Due: {formatDate(invoice.dueAt)}
              </p>
            )}
            <p className="mt-2 text-sm capitalize text-teal-700">{invoice.status}</p>
          </div>
        </header>

        <section className="mb-10">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-600">
            Bill to
          </h2>
          <p className="font-medium text-[#1e3a5f]">
            {patientName(invoice.patient.firstName, invoice.patient.lastName)}
          </p>
          <p className="text-sm text-sky-700">{invoice.patient.email}</p>
          {invoice.patient.phone && (
            <p className="text-sm text-sky-700">{invoice.patient.phone}</p>
          )}
        </section>

        <table className="mb-10 w-full text-sm">
          <thead>
            <tr className="border-b border-sky-200 text-left text-xs uppercase text-sky-600">
              <th className="pb-3 font-semibold">Description</th>
              <th className="pb-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-sky-100">
                <td className="py-3 text-[#1e3a5f]">{item.label}</td>
                <td className="py-3 text-right text-[#1e3a5f]">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="pt-4 text-right font-semibold text-[#1e3a5f]">Total</td>
              <td className="pt-4 text-right text-xl font-bold text-teal-700">
                {formatCurrency(invoice.amount)}
              </td>
            </tr>
          </tfoot>
        </table>

        <footer className="border-t border-sky-200 pt-6 text-sm text-sky-600">
          <p>Thank you for choosing {doctor.clinicName}.</p>
          <p className="mt-2">Please contact us if you have questions about this invoice.</p>
        </footer>
      </article>
    </div>
  );
}
