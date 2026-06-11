import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { emailTemplatesAvailable } from "@/lib/email-templates";
import {
  getDoctorNotificationEmail,
  isSmtpConfigured,
  verifySmtpConnection,
} from "@/lib/email";

export async function GET() {
  const databaseUrlSet = Boolean(env("DATABASE_URL"));
  const sessionSecretSet = Boolean(env("PORTAL_SESSION_SECRET"));
  const smtpConfigured = isSmtpConfigured();
  const templatesOk = emailTemplatesAvailable();
  const doctorEmail = getDoctorNotificationEmail();

  let smtpVerify: { ok: boolean; error?: string } = { ok: false };
  if (smtpConfigured) {
    smtpVerify = await verifySmtpConnection();
  } else {
    smtpVerify = { ok: false, error: "SMTP not configured" };
  }

  if (!databaseUrlSet) {
    return NextResponse.json({
      ok: false,
      database: "DATABASE_URL is not set on this deployment",
      sessionSecret: sessionSecretSet,
      smtp: smtpConfigured,
      smtpVerify,
      emailTemplates: templatesOk,
      doctorEmail,
    });
  }

  try {
    const doctors = await prisma.doctor.count();
    const patients = await prisma.patient.count();

    const emailReady =
      smtpConfigured && smtpVerify.ok && templatesOk && Boolean(doctorEmail);

    return NextResponse.json({
      ok: emailReady,
      database: "connected",
      doctors,
      patients,
      sessionSecret: sessionSecretSet,
      smtp: smtpConfigured,
      smtpVerify,
      emailTemplates: templatesOk,
      doctorEmail,
      cronSecretSet: Boolean(env("CRON_SECRET")),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";

    return NextResponse.json(
      {
        ok: false,
        database: "connection failed",
        error: message,
        sessionSecret: sessionSecretSet,
        smtp: smtpConfigured,
        smtpVerify,
        emailTemplates: templatesOk,
        doctorEmail,
      },
      { status: 503 },
    );
  }
}
