import { readFileSync } from "fs";
import path from "path";
import type { ChallengeResults } from "@/lib/types";
import { getRecommendedPackage } from "@/lib/packages";

const TEMPLATE_DIR = path.join(process.cwd(), "email-templates");
const THANK_YOU_FILE = "email-template.html";
const DOCTOR_NOTIFICATION_FILE = "doctor-notification.html";
const INVOICE_FILE = "invoice-template.html";

function formatSessionWhen(sessionDate: Date) {
  return sessionDate.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getContactEmail() {
  return process.env.DOCTOR_EMAIL ?? "info@acuactiv.com";
}

function loadTemplate(filename: string) {
  const filePath = path.join(TEMPLATE_DIR, filename);
  return readFileSync(filePath, "utf-8");
}

function renderTemplate(
  html: string,
  vars: Record<string, string | number>,
) {
  return Object.entries(vars).reduce(
    (out, [key, value]) =>
      out.replaceAll(`{{${key}}}`, String(value)),
    html,
  );
}

export function buildChallengeThankYouEmail(results: ChallengeResults) {
  const pkg = getRecommendedPackage(results.grandTotal);
  const patientName = `${results.personal.firstName} ${results.personal.lastName}`.trim();
  const completedAt = new Date(results.completedAt).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const html = renderTemplate(loadTemplate(THANK_YOU_FILE), {
    patientName,
    firstName: results.personal.firstName,
    lastName: results.personal.lastName,
    email: results.personal.email,
    grandTotal: results.grandTotal,
    maxTotal: results.maxTotal,
    toxicLevelPercent: results.toxicLevelPercent.toFixed(1),
    toxicLevelLabel: results.toxicLevelLabel,
    packageNumber: pkg.package,
    packageSessions: pkg.sessions,
    completedAt,
    clinicName: process.env.CLINIC_NAME ?? "AcuActiv",
  });

  const subject =
    process.env.CHALLENGE_THANK_YOU_SUBJECT ??
    "Thank you for completing the AcuActiv Detox Challenge";

  const text = `Dear ${patientName}, thank you for completing the AcuActiv Detox Challenge. Score: ${results.grandTotal}/${results.maxTotal} (${results.toxicLevelPercent.toFixed(1)}%). Recommended Package ${pkg.package}.`;

  return { subject, html, text };
}

export function buildDoctorNewAssessmentEmail(results: ChallengeResults) {
  const pkg = getRecommendedPackage(results.grandTotal);
  const { personal } = results;
  const patientName = `${personal.firstName} ${personal.lastName}`.trim();
  const completedAt = new Date(results.completedAt).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const categoryBreakdown = results.categories
    .map(
      (c) =>
        `<p style="margin:0 0 6px;">${c.name}: ${c.score}/${c.maxScore} (${c.percent.toFixed(0)}%)</p>`,
    )
    .join("");

  const html = renderTemplate(loadTemplate(DOCTOR_NOTIFICATION_FILE), {
    patientName,
    email: personal.email,
    phone: personal.phone || "—",
    dateOfBirth: personal.dateOfBirth || "—",
    grandTotal: results.grandTotal,
    maxTotal: results.maxTotal,
    toxicLevelPercent: results.toxicLevelPercent.toFixed(1),
    toxicLevelLabel: results.toxicLevelLabel,
    packageNumber: pkg.package,
    packageSessions: pkg.sessions,
    completedAt,
    categoryBreakdown,
  });

  const subject = `New patient assessment — ${patientName} (Package ${pkg.package})`;
  const text = `New detox challenge: ${patientName}, ${personal.email}, score ${results.grandTotal}/${results.maxTotal}, ${results.toxicLevelLabel}, Package ${pkg.package}.`;

  return { subject, html, text };
}

export function buildSessionInvoiceEmail(
  patientName: string,
  invoiceNumber: string,
  amount: number,
  sessionDate: Date,
  clinicName: string,
  options?: { sessionLabel?: string; description?: string },
) {
  const sessionWhen = formatSessionWhen(sessionDate);
  const amountFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
  const sessionLabel = options?.sessionLabel ?? "Detox treatment session";
  const description =
    options?.description ?? `AcuActiv detox session — ${sessionWhen}`;

  const html = renderTemplate(loadTemplate(INVOICE_FILE), {
    patientName,
    invoiceNumber,
    sessionWhen,
    amountFormatted,
    sessionLabel,
    description,
    clinicName,
    contactEmail: getContactEmail(),
  });

  const subject = `Invoice ${invoiceNumber} — ${clinicName} session`;
  const text = `Dear ${patientName}, your invoice ${invoiceNumber} for ${amountFormatted} is due for your session on ${sessionWhen}. Contact ${getContactEmail()} or (888) 770-6887.`;

  return { subject, html, text };
}
