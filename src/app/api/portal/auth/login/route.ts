import { NextResponse } from "next/server";
import {
  createPortalSessionToken,
  getPortalSessionCookieOptions,
  requireDoctor,
  verifyDoctorCredentials,
} from "@/lib/portal-auth";

const COOKIE_NAME = "portal_session";

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

    const token = await createPortalSessionToken(doctor.id);
    const response = NextResponse.json({
      ok: true,
      doctor: {
        id: doctor.id,
        username: doctor.username,
        name: doctor.name,
      },
    });
    response.cookies.set(COOKIE_NAME, token, getPortalSessionCookieOptions());

    return response;
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
