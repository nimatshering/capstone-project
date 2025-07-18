import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { NextResponse, NextRequest } from "next/server";
import { cookies as getCookies } from "next/headers";

export type SessionPayload = {
  userId: string;
  username?: string;
  expiresAt: string;
};

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) throw new Error("SESSION_SECRET is not defined");

const encodedKey = new TextEncoder().encode(secretKey);

// Sign (encrypt) the Token with 7 days expiration
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

// Verify and decode Token
export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.error("Failed to verify session:", error);
    return null;
  }
}

// Create session using cookies
export async function createSession(
  userId: string,
  response: NextResponse
): Promise<NextResponse> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const payload: SessionPayload = {
    userId,
    expiresAt: expiresAt.toISOString(),
  };

  const token = await encrypt(payload);

  response.cookies.set("session", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}

// Delete session cookie
export function deleteSession(
  _req: NextRequest,
  response: NextResponse
): NextResponse {
  response.cookies.set("session", "", {
    path: "/",
    maxAge: 0,
  });
  return response;
}

// Retrieve and verify session from request or server context
export async function getSession(
  req?: Request
): Promise<SessionPayload | null> {
  let token: string | undefined;

  if (req) {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const parsedCookies = Object.fromEntries(
      cookieHeader
        .split(";")
        .map((c) => c.trim().split("="))
        .map(([k, v]) => [k, decodeURIComponent(v)])
    );
    token = parsedCookies["session"];
  } else {
    const cookieStore = await getCookies();
    token = cookieStore.get("session")?.value;
  }

  if (!token) return null;

  const payload = await decrypt(token);
  if (!payload) return null;

  // manual expiration check
  if (new Date(payload.expiresAt) < new Date()) {
    return null;
  }

  return payload;
}
