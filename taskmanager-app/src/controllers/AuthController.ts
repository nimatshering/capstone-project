// app/controllers/AuthController.ts
import { NextRequest, NextResponse } from "next/server";
import { createSession, deleteSession, getSession } from "@/lib/session";
import { findUserByUsername } from "@/models/AuthModel";
import bcrypt from "bcryptjs";

// POST /api/login
export async function login(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    const user = await findUserByUsername(username);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create response and set session cookie
    const response = NextResponse.json({ success: true, userId: user.id });
    await createSession(user.id, response);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/logout
export async function logout(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  deleteSession(req, response); // No need to await deleteSession
  return response;
}

// GET /api/session (or /api/me)
export async function getCurrentUser(req: NextRequest) {
  const session = await getSession(req);

  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({
    user: {
      id: session.userId,
    },
  });
}
