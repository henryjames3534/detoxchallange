import { NextResponse } from "next/server";
import { hashPassword, requireDoctor } from "@/lib/portal-auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const doctor = await requireDoctor();
  if (!doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = (await request.json()) as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return NextResponse.json(
      { error: "Current password and new password (8+ chars) required" },
      { status: 400 },
    );
  }

  const record = await prisma.doctor.findUnique({ where: { id: doctor.id } });
  if (!record) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  const valid = await bcrypt.compare(currentPassword, record.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  await prisma.doctor.update({
    where: { id: doctor.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  return NextResponse.json({ ok: true });
}
