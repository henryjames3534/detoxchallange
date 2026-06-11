import nodemailer from "nodemailer";
import { env, envOr } from "@/lib/env";
import { formatSessionWhenEastern } from "@/lib/timezone";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

function getSmtpConfig() {
  const host = env("SMTP_HOST");
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS")?.replace(/\s/g, "");
  const port = Number(env("SMTP_PORT") ?? "587");

  if (!host || !user || !pass) return null;

  return { host, user, pass, port };
}

function getTransporter() {
  const config = getSmtpConfig();
  if (!config) return null;

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port === 587,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 20_000,
    greetingTimeout: 20_000,
    socketTimeout: 25_000,
  });
}

export function getDoctorNotificationEmail() {
  return envOr(
    "DOCTOR_EMAIL",
    envOr("DOCTOR_NOTIFICATION_EMAIL", "acuactiv@gmail.com"),
  );
}

export function isSmtpConfigured() {
  return getSmtpConfig() !== null;
}

function getFromAddress() {
  const from = env("SMTP_FROM");
  if (from) return from;
  const user = env("SMTP_USER");
  if (user) return `AcuActiv <${user}>`;
  return "AcuActiv Detox <noreply@acuactiv.com>";
}

export async function verifySmtpConnection() {
  const config = getSmtpConfig();
  if (!config) {
    return { ok: false as const, error: "SMTP env vars missing or empty" };
  }

  const transporter = getTransporter();
  if (!transporter) {
    return { ok: false as const, error: "Could not create SMTP transporter" };
  }

  try {
    await transporter.verify();
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const recipient = to?.trim();
  if (!recipient) {
    throw new Error("Email recipient is empty");
  }

  const from = getFromAddress();
  const transporter = getTransporter();

  if (!transporter) {
    console.info("[email:dev]", {
      to: recipient,
      subject,
      text: text ?? html.slice(0, 200),
    });
    return { ok: true as const, dev: true as const };
  }

  try {
    await transporter.sendMail({
      from,
      to: recipient,
      subject,
      html,
      text,
    });
    return { ok: true as const, dev: false as const };
  } catch (error) {
    console.error("[email:error]", { to: recipient, subject, error });
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
