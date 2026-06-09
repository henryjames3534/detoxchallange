import nodemailer from "nodemailer";

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
    auth: { user, pass },
  });
}

export function getDoctorNotificationEmail() {
  return (
    process.env.DOCTOR_EMAIL ??
    process.env.DOCTOR_NOTIFICATION_EMAIL ??
    "henryjames3534@gmail.com"
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

function formatSessionWhen(sessionDate: Date) {
  return sessionDate.toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function buildSessionReminderEmail(
  patientName: string,
  sessionDate: Date,
  clinicName: string,
) {
  const when = formatSessionWhen(sessionDate);
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
  const when = formatSessionWhen(sessionDate);
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

export function buildSessionInvoiceEmail(
  patientName: string,
  invoiceNumber: string,
  amount: number,
  sessionDate: Date,
  clinicName: string,
) {
  const when = formatSessionWhen(sessionDate);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
  const subject = `Invoice ${invoiceNumber} — ${clinicName} session`;
  const html = `
    <p>Dear ${patientName},</p>
    <p>Your invoice for the upcoming detox session on <strong>${when}</strong> is ready.</p>
    <table cellpadding="8" style="border-collapse:collapse;margin:16px 0;">
      <tr><td><strong>Invoice #</strong></td><td>${invoiceNumber}</td></tr>
      <tr><td><strong>Session</strong></td><td>${when}</td></tr>
      <tr><td><strong>Amount due</strong></td><td>${formatted}</td></tr>
    </table>
    <p>Please bring payment or contact us at (888) 770-6887 or acuactiv@gmail.com before your appointment.</p>
    <p>Warm regards,<br/>${clinicName}</p>
  `;
  return {
    subject,
    html,
    text: `${subject} — ${formatted} for session on ${when}. Invoice ${invoiceNumber}.`,
  };
}
