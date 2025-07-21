import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  //  public paths
  const publicPaths = [
    "/login",
    "/register",
    "/api/login",
    "/api/register",
    "/api/users",
  ];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublic) return NextResponse.next();

  // Check session
  const token = req.cookies.get("session")?.value;
  console.log("Session token:", token ?? "None");

  if (!token) {
    console.log("No token found, redirecting to login.");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const session = await decrypt(token);
  console.log("Middleware session:", session);

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
