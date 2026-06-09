import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const databaseUrlSet = Boolean(process.env.DATABASE_URL);
  const sessionSecretSet = Boolean(process.env.PORTAL_SESSION_SECRET);
  const smtpConfigured = Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
  );

  if (!databaseUrlSet) {
    return NextResponse.json({
      ok: false,
      database: "DATABASE_URL is not set on this deployment",
      sessionSecret: sessionSecretSet,
      smtp: smtpConfigured,
    });
  }

  try {
    const doctors = await prisma.doctor.count();
    const patients = await prisma.patient.count();

    return NextResponse.json({
      ok: true,
      database: "connected",
      doctors,
      patients,
      sessionSecret: sessionSecretSet,
      smtp: smtpConfigured,
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
      },
      { status: 503 },
    );
  }
}
