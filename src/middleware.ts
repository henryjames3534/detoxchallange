import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PORTAL_PATHS = ["/portal/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/portal")) {
    return NextResponse.next();
  }

  if (PUBLIC_PORTAL_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("portal_session")?.value;
  if (!token) {
    const login = new URL("/portal/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"],
};
