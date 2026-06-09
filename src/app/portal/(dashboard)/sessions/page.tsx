import { prisma } from "@/lib/db";
import { QuickBookClient } from "@/components/portal/QuickBookClient";
import { SessionsListClient } from "@/components/portal/SessionsListClient";
import { ProcessRemindersButton } from "@/components/portal/ProcessRemindersButton";

export default async function SessionsPage() {
  const [sessions, patients] = await Promise.all([
    prisma.session.findMany({
      orderBy: { scheduledAt: "asc" },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    }),
    prisma.patient.findMany({
      orderBy: { lastName: "asc" },
      select: { id: true, firstName: true, lastName: true },
    }),
  ]);

  const now = new Date();
  const upcoming = sessions.filter(
    (s) => s.status !== "cancelled" && new Date(s.scheduledAt) >= now,
  );
  const past = sessions.filter(
    (s) => s.status === "cancelled" || new Date(s.scheduledAt) < now,
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Session Calendar</h1>
        <p className="mt-1 text-sm text-sky-700">
          Package sessions auto-schedule weekly (1 per week). Reminders go to
          patient and doctor 24h before; invoices email 12h before.
        </p>
        <ProcessRemindersButton />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-[#1e3a5f]">Quick book</h2>
          {patients.length === 0 ? (
            <p className="text-sm text-sky-700">No patients available yet.</p>
          ) : (
            <QuickBookClient patients={patients} />
          )}
        </div>
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-[#1e3a5f]">
            Upcoming ({upcoming.length})
          </h2>
          <SessionsListClient sessions={upcoming} />
        </div>
      </div>

      {past.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-[#1e3a5f]">
            Past & cancelled
          </h2>
          <SessionsListClient sessions={past} />
        </div>
      )}
    </div>
  );
}
