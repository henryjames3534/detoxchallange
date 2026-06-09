import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "portal_session";
const SESSION_HOURS = 12;

export function getPortalSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  };
}

function getSecret() {
  const secret = process.env.PORTAL_SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("PORTAL_SESSION_SECRET is required in production");
  }
  return new TextEncoder().encode(secret ?? "dev-portal-secret-change-me");
}

export async function createPortalSessionToken(doctorId: string) {
  return new SignJWT({ doctorId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(getSecret());
}

export async function createPortalSession(doctorId: string) {
  const token = await createPortalSessionToken(doctorId);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, getPortalSessionCookieOptions());
}

export async function clearPortalSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionDoctorId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return typeof payload.doctorId === "string" ? payload.doctorId : null;
  } catch {
    return null;
  }
}

export async function requireDoctor() {
  const doctorId = await getSessionDoctorId();
  if (!doctorId) return null;

  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      clinicName: true,
    },
  });

  return doctor;
}

export async function verifyDoctorCredentials(
  username: string,
  password: string,
) {
  const doctor = await prisma.doctor.findUnique({ where: { username } });
  if (!doctor) return null;

  const valid = await bcrypt.compare(password, doctor.passwordHash);
  if (!valid) return null;

  return doctor;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
