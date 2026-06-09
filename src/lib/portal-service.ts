import type { ChallengeResults } from "@/lib/types";
import { prisma } from "@/lib/db";
import { getRecommendedPackage } from "@/lib/packages";
import {
  createPackageSessionsForAssessment,
  getSessionScheduleConfig,
  resetSessionAutomationOnReschedule,
} from "@/lib/session-scheduling";

export { resetSessionAutomationOnReschedule };

export async function saveAssessmentFromResults(results: ChallengeResults) {
  const pkg = getRecommendedPackage(results.grandTotal);
  const { personal } = results;
  const submissionId =
    results.submissionId ??
    `${personal.email.toLowerCase().trim()}:${results.completedAt}`;

  const existing = await prisma.assessment.findUnique({
    where: { submissionId },
    include: { patient: true },
  });
  if (existing) {
    return {
      patient: existing.patient,
      assessment: existing,
      sessions: { created: 0, skipped: true },
      isDuplicate: true as const,
    };
  }

  const patient = await prisma.patient.upsert({
    where: { email: personal.email.toLowerCase().trim() },
    create: {
      firstName: personal.firstName,
      lastName: personal.lastName,
      email: personal.email.toLowerCase().trim(),
      phone: personal.phone || null,
      dateOfBirth: personal.dateOfBirth || null,
    },
    update: {
      firstName: personal.firstName,
      lastName: personal.lastName,
      phone: personal.phone || null,
      dateOfBirth: personal.dateOfBirth || null,
    },
  });

  const assessment = await prisma.assessment.create({
    data: {
      patientId: patient.id,
      submissionId,
      grandTotal: results.grandTotal,
      maxTotal: results.maxTotal,
      toxicLevelPercent: results.toxicLevelPercent,
      toxicLevelLabel: results.toxicLevelLabel,
      packageNumber: pkg.package,
      packageSessions: pkg.sessions,
      resultsJson: JSON.stringify(results),
      completedAt: new Date(results.completedAt),
    },
  });

  const sessions = await createPackageSessionsForAssessment(
    patient.id,
    assessment.id,
    pkg.package,
    pkg.sessions,
    new Date(results.completedAt),
  );

  return { patient, assessment, sessions, isDuplicate: false as const };
}

export async function markChallengeEmailsSent(assessmentId: string) {
  const now = new Date();
  return prisma.assessment.update({
    where: { id: assessmentId },
    data: {
      thankYouEmailSentAt: now,
      doctorEmailSentAt: now,
    },
  });
}

export async function generateSessionsForAssessment(assessmentId: string) {
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
  });
  if (!assessment) return null;

  return createPackageSessionsForAssessment(
    assessment.patientId,
    assessment.id,
    assessment.packageNumber,
    assessment.packageSessions,
    assessment.completedAt,
  );
}

export async function generateInvoiceNumber() {
  const prefix = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;
  const count = await prisma.invoice.count({
    where: { invoiceNumber: { startsWith: prefix } },
  });
  return `${prefix}-${String(count + 1).padStart(3, "0")}`;
}

export async function processSessionAutomation() {
  const now = new Date();
  const reminderFrom = new Date(now.getTime() + 23 * 60 * 60 * 1000);
  const reminderTo = new Date(now.getTime() + 25 * 60 * 60 * 1000);
  const invoiceFrom = new Date(now.getTime() + 11 * 60 * 60 * 1000);
  const invoiceTo = new Date(now.getTime() + 13 * 60 * 60 * 1000);

  const doctor = await prisma.doctor.findFirst();
  const {
    sendEmail,
    getDoctorNotificationEmail,
    buildSessionReminderEmail,
    buildDoctorSessionReminderEmail,
    buildSessionInvoiceEmail,
  } = await import("@/lib/email");
  const doctorEmail = doctor?.email ?? getDoctorNotificationEmail();

  const reminderSessions = await prisma.session.findMany({
    where: {
      status: "scheduled",
      scheduledAt: { gte: reminderFrom, lte: reminderTo },
    },
    include: { patient: true },
  });

  let patientReminders = 0;
  let doctorReminders = 0;

  for (const session of reminderSessions) {
    const name = `${session.patient.firstName} ${session.patient.lastName}`;

    if (!session.patientReminderSentAt) {
      const { subject, html, text } = buildSessionReminderEmail(
        name,
        session.scheduledAt,
        doctor?.clinicName ?? "AcuActiv",
      );
      await sendEmail({
        to: session.patient.email,
        subject,
        html,
        text,
      });
      await prisma.session.update({
        where: { id: session.id },
        data: { patientReminderSentAt: new Date() },
      });
      patientReminders++;
    }

    if (!session.doctorReminderSentAt && doctorEmail) {
      const { subject, html, text } = buildDoctorSessionReminderEmail(
        name,
        session.scheduledAt,
        session.sessionIndex,
      );
      await sendEmail({
        to: doctorEmail,
        subject,
        html,
        text,
      });
      await prisma.session.update({
        where: { id: session.id },
        data: { doctorReminderSentAt: new Date() },
      });
      doctorReminders++;
    }
  }

  const invoiceSessions = await prisma.session.findMany({
    where: {
      status: "scheduled",
      scheduledAt: { gte: invoiceFrom, lte: invoiceTo },
    },
    include: {
      patient: true,
      invoice: true,
    },
  });

  const config = getSessionScheduleConfig();
  let invoicesCreated = 0;
  let invoicesSent = 0;

  for (const session of invoiceSessions) {
    let invoice = session.invoice;

    if (!invoice) {
      const patientName = `${session.patient.firstName} ${session.patient.lastName}`;
      const sessionLabel = session.sessionIndex
        ? `Session ${session.sessionIndex}`
        : "Detox session";
      const when = session.scheduledAt.toLocaleString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

      invoice = await prisma.invoice.create({
        data: {
          patientId: session.patientId,
          sessionId: session.id,
          invoiceNumber: await generateInvoiceNumber(),
          amount: config.sessionPrice,
          description: `AcuActiv ${sessionLabel} — ${when}`,
          autoGenerated: true,
          dueAt: session.scheduledAt,
          itemsJson: JSON.stringify([
            {
              label: `Detox treatment — ${sessionLabel}`,
              amount: config.sessionPrice,
            },
          ]),
        },
      });
      invoicesCreated++;
    }

    if (!invoice.emailSentAt) {
      const patientName = `${session.patient.firstName} ${session.patient.lastName}`;
      const { subject, html, text } = buildSessionInvoiceEmail(
        patientName,
        invoice.invoiceNumber,
        invoice.amount,
        session.scheduledAt,
        doctor?.clinicName ?? "AcuActiv",
      );
      await sendEmail({
        to: session.patient.email,
        subject,
        html,
        text,
      });
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { emailSentAt: new Date() },
      });
      invoicesSent++;
    }
  }

  return {
    patientReminders,
    doctorReminders,
    invoicesCreated,
    invoicesSent,
    checkedReminders: reminderSessions.length,
    checkedInvoices: invoiceSessions.length,
  };
}

/** @deprecated Use processSessionAutomation */
export async function processSessionReminders() {
  const result = await processSessionAutomation();
  return {
    sent: result.patientReminders,
    checked: result.checkedReminders,
  };
}
