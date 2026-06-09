import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  buildDoctorSessionReminderEmail,
  buildSessionReminderEmail,
  getDoctorNotificationEmail,
  isSmtpConfigured,
  sendEmail,
} from "@/lib/email";
import {
  buildChallengeThankYouEmail,
  buildDoctorNewAssessmentEmail,
  buildSessionInvoiceEmail,
} from "@/lib/email-templates";
import type { ChallengeResults } from "@/lib/types";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

function sampleResults(): ChallengeResults {
  const now = new Date().toISOString();
  return {
    personal: {
      firstName: "Test",
      lastName: "Patient",
      email: getDoctorNotificationEmail(),
      phone: "555-0100",
      dateOfBirth: "1990-01-01",
      testDate: now,
      unitSystem: "imperial",
    },
    grandTotal: 42,
    maxTotal: 120,
    toxicLevelPercent: 35,
    toxicLevelLabel: "Moderate",
    completedAt: now,
    categories: [
      {
        categoryId: "digestive",
        name: "Digestive",
        score: 8,
        maxScore: 15,
        percent: 53,
      },
      {
        categoryId: "liver",
        name: "Liver",
        score: 6,
        maxScore: 15,
        percent: 40,
      },
    ],
  };
}

async function verifySmtpConnection() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s/g, "");
  const port = Number(process.env.SMTP_PORT ?? 587);

  if (!host || !user || !pass) {
    return { ok: false, error: "SMTP env vars missing" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });

  try {
    await transporter.verify();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const to =
    (await request.json().catch(() => ({}))) as { to?: string };
  const recipient = to.to ?? getDoctorNotificationEmail();

  const smtpVerify = await verifySmtpConnection();
  const results: Array<{ name: string; ok: boolean; error?: string }> = [];

  if (!smtpVerify.ok) {
    return NextResponse.json(
      {
        ok: false,
        smtpConfigured: isSmtpConfigured(),
        smtpVerify,
        sent: results,
      },
      { status: 503 },
    );
  }

  const sampleSessionDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const clinicName = process.env.CLINIC_NAME ?? "AcuActiv";
  const patientName = "Test Patient";

  const tests: Array<{ name: string; send: () => Promise<void> }> = [
    {
      name: "setup-verification",
      send: async () => {
        await sendEmail({
          to: recipient,
          subject: "[AcuActiv TEST] Setup verification from Vercel",
          html: "<p>SMTP test from production Vercel deployment.</p>",
          text: "SMTP test from production Vercel deployment.",
        });
      },
    },
    {
      name: "thank-you",
      send: async () => {
        const email = buildChallengeThankYouEmail(sampleResults());
        await sendEmail({
          to: recipient,
          subject: `[TEST] ${email.subject}`,
          html: email.html,
          text: email.text,
        });
      },
    },
    {
      name: "doctor-notification",
      send: async () => {
        const email = buildDoctorNewAssessmentEmail(sampleResults());
        await sendEmail({
          to: recipient,
          subject: `[TEST] ${email.subject}`,
          html: email.html,
          text: email.text,
        });
      },
    },
    {
      name: "patient-session-reminder",
      send: async () => {
        const email = buildSessionReminderEmail(
          patientName,
          sampleSessionDate,
          clinicName,
        );
        await sendEmail({
          to: recipient,
          subject: `[TEST] ${email.subject}`,
          html: email.html,
          text: email.text,
        });
      },
    },
    {
      name: "doctor-session-reminder",
      send: async () => {
        const email = buildDoctorSessionReminderEmail(
          patientName,
          sampleSessionDate,
          1,
        );
        await sendEmail({
          to: recipient,
          subject: `[TEST] ${email.subject}`,
          html: email.html,
          text: email.text,
        });
      },
    },
    {
      name: "session-invoice",
      send: async () => {
        const email = buildSessionInvoiceEmail(
          patientName,
          "INV-TEST-001",
          Number(process.env.PORTAL_SESSION_PRICE ?? 150),
          sampleSessionDate,
          clinicName,
        );
        await sendEmail({
          to: recipient,
          subject: `[TEST] ${email.subject}`,
          html: email.html,
          text: email.text,
        });
      },
    },
  ];

  for (const test of tests) {
    try {
      await test.send();
      results.push({ name: test.name, ok: true });
    } catch (error) {
      results.push({
        name: test.name,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const allOk = results.every((r) => r.ok);

  return NextResponse.json(
    {
      ok: allOk,
      smtpConfigured: isSmtpConfigured(),
      smtpVerify,
      recipient,
      sent: results,
    },
    { status: allOk ? 200 : 207 },
  );
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const smtpVerify = await verifySmtpConnection();

  return NextResponse.json({
    smtpConfigured: isSmtpConfigured(),
    smtpHost: process.env.SMTP_HOST ?? null,
    smtpUser: process.env.SMTP_USER ?? null,
    smtpPort: process.env.SMTP_PORT ?? "587",
    smtpFrom: process.env.SMTP_FROM ?? null,
    doctorEmail: getDoctorNotificationEmail(),
    smtpVerify,
  });
}
