import "dotenv/config";
import { prisma } from "../src/lib/db";
import { isSmtpConfigured, sendEmail } from "../src/lib/email";

async function main() {
  console.log("DATABASE_URL set:", Boolean(process.env.DATABASE_URL));
  console.log("SMTP configured:", isSmtpConfigured());

  const doctorCount = await prisma.doctor.count();
  const patientCount = await prisma.patient.count();
  console.log(`Doctors: ${doctorCount}, Patients: ${patientCount}`);

  const to = process.env.DOCTOR_EMAIL ?? process.env.SMTP_USER;
  if (!to) {
    console.log("Skip email test — no recipient configured");
    return;
  }

  await sendEmail({
    to,
    subject: "[AcuActiv] Setup verification — DB + SMTP OK",
    html: "<p>Your Neon database and Gmail SMTP are working correctly.</p>",
    text: "Your Neon database and Gmail SMTP are working correctly.",
  });
  console.log(`Verification email sent to ${to}`);
}

main()
  .catch((err) => {
    console.error("Setup verification failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
