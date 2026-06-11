import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { ChallengeResults } from "@/lib/types";
import { getRecommendedPackage } from "@/lib/packages";
import { envOr } from "@/lib/env";
import {
  formatCompletedAtEastern,
  formatSessionWhenEastern,
} from "@/lib/timezone";

const THANK_YOU_FILE = "email-template.html";
const DOCTOR_NOTIFICATION_FILE = "doctor-notification.html";
const INVOICE_FILE = "invoice-template.html";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

function resolveTemplatePath(filename: string): string {
  const candidates = [
    path.join(process.cwd(), "email-templates", filename),
    path.join(moduleDir, "..", "..", "email-templates", filename),
    path.join(moduleDir, "..", "..", "..", "email-templates", filename),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  throw new Error(
    `Email template "${filename}" not found. Checked: ${candidates.join(", ")}`,
  );
}

function loadTemplate(filename: string) {
  return readFileSync(resolveTemplatePath(filename), "utf-8");
}

export function emailTemplatesAvailable(): boolean {
  try {
    loadTemplate(THANK_YOU_FILE);
    loadTemplate(DOCTOR_NOTIFICATION_FILE);
    loadTemplate(INVOICE_FILE);
    return true;
  } catch {
    return false;
  }
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

function getContactEmail() {
  return envOr("DOCTOR_EMAIL", "acuactiv@gmail.com");
}

export function buildChallengeThankYouEmail(results: ChallengeResults) {
  const pkg = getRecommendedPackage(results.grandTotal);
  const patientName = `${results.personal.firstName} ${results.personal.lastName}`.trim();
  const completedAt = formatCompletedAtEastern(results.completedAt);

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
    clinicName: envOr("CLINIC_NAME", "AcuActiv"),
  });

  const subject = envOr(
    "CHALLENGE_THANK_YOU_SUBJECT",
    "Thank you for completing the AcuActiv Detox Challenge",
  );

  const text = `Dear ${patientName}, thank you for completing the AcuActiv Detox Challenge. Score: ${results.grandTotal}/${results.maxTotal} (${results.toxicLevelPercent.toFixed(1)}%). Recommended Package ${pkg.package}.`;

  return { subject, html, text };
}

export function buildDoctorNewAssessmentEmail(results: ChallengeResults) {
  const pkg = getRecommendedPackage(results.grandTotal);
  const { personal } = results;
  const patientName = `${personal.firstName} ${personal.lastName}`.trim();
  const completedAt = formatCompletedAtEastern(results.completedAt);

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
  const when = formatSessionWhenEastern(sessionDate);
  const sessionLabel = options?.sessionLabel ?? "Detox session";
  const description =
    options?.description ?? `AcuActiv ${sessionLabel} — ${when}`;

  const html = renderTemplate(loadTemplate(INVOICE_FILE), {
    patientName,
    invoiceNumber,
    amount: amount.toFixed(2),
    sessionLabel,
    sessionWhen: when,
    description,
    clinicName,
    contactEmail: getContactEmail(),
  });

  const subject = `Invoice ${invoiceNumber} — ${clinicName}`;
  const text = `Invoice ${invoiceNumber} for ${patientName}: $${amount.toFixed(2)}. ${description}`;

  return { subject, html, text };
}
