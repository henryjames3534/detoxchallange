import "dotenv/config";
import {
  buildDoctorSessionReminderEmail,
  buildSessionReminderEmail,
  sendEmail,
} from "../src/lib/email";
import { buildSessionInvoiceEmail } from "../src/lib/email-templates";

const TEST_TO = process.env.TEST_EMAIL_TO ?? "henryjames3534@gmail.com";
const clinicName = process.env.CLINIC_NAME ?? "AcuActiv";

const sampleSessionDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
const patientName = "Test Patient";

async function main() {
  const patientReminder = buildSessionReminderEmail(
    patientName,
    sampleSessionDate,
    clinicName,
  );
  await sendEmail({
    to: TEST_TO,
    subject: `[TEST] Patient reminder — ${patientReminder.subject}`,
    html: `<p style="color:#64748b;font-size:12px;"><em>Preview: email sent to patient 24 hours before session</em></p>${patientReminder.html}`,
    text: patientReminder.text,
  });
  console.log("Sent patient session reminder test");

  const doctorReminder = buildDoctorSessionReminderEmail(
    patientName,
    sampleSessionDate,
    3,
  );
  await sendEmail({
    to: TEST_TO,
    subject: `[TEST] Doctor reminder — ${doctorReminder.subject}`,
    html: `<p style="color:#64748b;font-size:12px;"><em>Preview: email sent to doctor 24 hours before session</em></p>${doctorReminder.html}`,
    text: doctorReminder.text,
  });
  console.log("Sent doctor session reminder test");

  const invoice = buildSessionInvoiceEmail(
    patientName,
    "INV-TEST-001",
    Number(process.env.PORTAL_SESSION_PRICE ?? 150),
    sampleSessionDate,
    clinicName,
  );
  await sendEmail({
    to: TEST_TO,
    subject: `[TEST] Invoice — ${invoice.subject}`,
    html: `<p style="color:#64748b;font-size:12px;"><em>Preview: email sent to patient 12 hours before session</em></p>${invoice.html}`,
    text: invoice.text,
  });
  console.log("Sent session invoice test");

  console.log(`\nAll 3 test emails sent to ${TEST_TO}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
