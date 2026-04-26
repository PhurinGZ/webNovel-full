import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin paths protection
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Author paths protection
    if ((path.startsWith("/write") || path.startsWith("/dashboard")) && 
        token?.role !== "AUTHOR" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/write/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/api/purchases/:path*",
    "/api/history/:path*",
  ],
};
