import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) return NextResponse.next();

  const pathname = req.nextUrl.pathname;
  const isAuthPage = pathname === "/" || pathname === "/welcome";
  const isCompleteProfile = pathname === "/complete-profile";

  if (!token.name && isAuthPage && !isCompleteProfile) {
    const url = req.nextUrl.clone();
    url.pathname = "/complete-profile";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/welcome", "/dashboard/:path*"],
};
