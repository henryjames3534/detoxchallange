import { prisma } from "@/lib/db";
import { SessionsCalendarClient } from "@/components/portal/SessionsCalendarClient";
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

  const serializedSessions = sessions.map((s) => ({
    ...s,
    scheduledAt: s.scheduledAt.toISOString(),
    patientReminderSentAt: s.patientReminderSentAt?.toISOString() ?? null,
    doctorReminderSentAt: s.doctorReminderSentAt?.toISOString() ?? null,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Session Calendar</h1>
        <p className="mt-1 text-sm text-sky-700">
          Filter by patient or date. Reminders go to patient and doctor 24h before;
          invoices email 12h before.
        </p>
        <ProcessRemindersButton />
      </div>

      <SessionsCalendarClient
        sessions={serializedSessions}
        patients={patients}
      />
    </div>
  );
}
