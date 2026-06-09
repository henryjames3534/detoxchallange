import { NextResponse } from "next/server";
import {
  createPortalSession,
  requireDoctor,
  verifyDoctorCredentials,
} from "@/lib/portal-auth";

export async function POST(request: Request) {
  try {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!username?.trim() || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    const doctor = await verifyDoctorCredentials(username.trim(), password);
    if (!doctor) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createPortalSession(doctor.id);

    return NextResponse.json({
      ok: true,
      doctor: {
        id: doctor.id,
        username: doctor.username,
        name: doctor.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function GET() {
  const doctor = await requireDoctor();
  if (!doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ doctor });
}
