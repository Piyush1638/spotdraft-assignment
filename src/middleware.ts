import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const url = request.nextUrl.clone();

  const isAuthPage = url.pathname === "/login" || url.pathname === "/signup";
  const isProtectedPage =
    url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/profile") || url.pathname.startsWith("/pdf");

  // 🚫 Redirect logged-in users away from login/signup
  if (token && isAuthPage) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 🔐 Redirect unauthenticated users away from protected pages
  if (!token && isProtectedPage) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// 👇 Apply middleware only to these routes
export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/profile/:path*",
    "/profile",
    "/pdf/:path*",
    "/pdf",
  ],
};


