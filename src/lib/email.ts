import nodemailer from "nodemailer";
import { formatSessionWhenEastern } from "@/lib/timezone";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s/g, "");
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT ?? 587);

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });
}

export function getDoctorNotificationEmail() {
  return (
    process.env.DOCTOR_EMAIL ??
    process.env.DOCTOR_NOTIFICATION_EMAIL ??
    "info@acuactiv.com"
  );
}

export function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS?.replace(/\s/g, ""),
  );
}

function getFromAddress() {
  if (process.env.SMTP_FROM) return process.env.SMTP_FROM;
  const user = process.env.SMTP_USER;
  if (user) return `AcuActiv <${user}>`;
  return "AcuActiv Detox <noreply@acuactiv.com>";
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const from = getFromAddress();
  const transporter = getTransporter();

  if (!transporter) {
    console.info("[email:dev]", { to, subject, text: text ?? html.slice(0, 200) });
    return { ok: true as const, dev: true as const };
  }

  try {
    await transporter.sendMail({ from, to, subject, html, text });
    return { ok: true as const, dev: false as const };
  } catch (error) {
    console.error("[email:error]", { to, subject, error });
    throw error;
  }
}

export function buildAssessmentReminderEmail(patientName: string) {
  const subject = "Your AcuActiv Detox Assessment — Follow Up";
  const html = `
    <p>Dear ${patientName},</p>
    <p>Thank you for completing the AcuActiv Detox Challenge assessment.</p>
    <p>Dr. Shlomi Gavish will review your results. If you have questions or wish to schedule a consultation, reply to this email or call (888) 770-6887.</p>
    <p>Warm regards,<br/>AcuActiv</p>
  `;
  return { subject, html, text: subject };
}

export function buildSessionReminderEmail(
  patientName: string,
  sessionDate: Date,
  clinicName: string,
) {
  const when = formatSessionWhenEastern(sessionDate);
  const subject = `Reminder: Your ${clinicName} session tomorrow`;
  const html = `
    <p>Dear ${patientName},</p>
    <p>This is a friendly reminder of your upcoming detox session:</p>
    <p><strong>${when}</strong></p>
    <p>Please contact us if you need to reschedule.</p>
    <p>Warm regards,<br/>${clinicName}</p>
  `;
  return { subject, html, text: `${subject} — ${when}` };
}

export function buildDoctorSessionReminderEmail(
  patientName: string,
  sessionDate: Date,
  sessionIndex: number | null,
) {
  const when = formatSessionWhenEastern(sessionDate);
  const label = sessionIndex ? `Session ${sessionIndex}` : "Session";
  const subject = `Reminder: ${label} with ${patientName} tomorrow`;
  const html = `
    <p>Doctor portal reminder</p>
    <p><strong>${patientName}</strong> has a scheduled detox ${label.toLowerCase()}:</p>
    <p><strong>${when}</strong></p>
    <p>Review or reschedule in the AcuActiv doctor portal.</p>
  `;
  return { subject, html, text: `${subject} — ${when}` };
}

export { buildSessionInvoiceEmail } from "@/lib/email-templates";
