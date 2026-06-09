import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const now = new Date();
  const reminderFrom = new Date(now.getTime() + 23 * 60 * 60 * 1000);
  const reminderTo = new Date(now.getTime() + 25 * 60 * 60 * 1000);
  const invoiceFrom = new Date(now.getTime() + 11 * 60 * 60 * 1000);
  const invoiceTo = new Date(now.getTime() + 13 * 60 * 60 * 1000);

  const sessions = await prisma.session.findMany({
    where: { status: "scheduled" },
    include: { patient: true, invoice: true },
    orderBy: { scheduledAt: "asc" },
  });

  console.log("Now:", now.toLocaleString());
  console.log("Reminder window:", reminderFrom.toLocaleString(), "→", reminderTo.toLocaleString());
  console.log("Invoice window: ", invoiceFrom.toLocaleString(), "→", invoiceTo.toLocaleString());
  console.log("\nScheduled sessions:", sessions.length);

  for (const s of sessions) {
    const at = new Date(s.scheduledAt);
    const inReminder = at >= reminderFrom && at <= reminderTo;
    const inInvoice = at >= invoiceFrom && at <= invoiceTo;
    console.log(
      `- ${s.patient.firstName} ${s.patient.lastName} | ${at.toLocaleString()} | reminder:${inReminder ? "YES" : "no"} | invoice:${inInvoice ? "YES" : "no"} | patientReminded:${!!s.patientReminderSentAt} | doctorReminded:${!!s.doctorReminderSentAt} | invoiceSent:${!!s.invoice?.emailSentAt}`,
    );
  }

  await prisma.$disconnect();
}

main().catch(console.error);
