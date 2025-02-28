import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  // Exclude static files and API routes from middleware checks
  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/static/") ||
    request.nextUrl.pathname.startsWith("/api/") // API routes
  ) {
    return NextResponse.next();
  }

  console.log("Middleware running on:", request.nextUrl.pathname);
  console.log("Token found:", token ? "Yes" : "No");

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|static|api).*)", // Exclude _next, static, and api paths
    "/settings/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
