import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true });
  return deleteSession(req, res); // this should clear the "session" cookie
}
