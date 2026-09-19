import { NextRequest, NextResponse } from "next/server";

const PUBLIC = [
  "/",
  "/login",
  "/signup",
  "/waitlist",
  "/investor-demo",
  "/legal",
  "/fees",
  "/markets",
  "/manifest.webmanifest",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("ai_session")?.value;
  const isPublic =
    PUBLIC.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    pathname.startsWith("/api/v1/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname.includes(".");

  if (!session && (pathname.startsWith("/app") || pathname.startsWith("/admin"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (session && (pathname === "/login" || pathname === "/signup") && !pathname.startsWith("/api")) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  void isPublic;
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*", "/login", "/signup"],
};
