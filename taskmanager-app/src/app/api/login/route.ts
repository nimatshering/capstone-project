import { login } from "@/controllers/AuthController";
import { NextRequest } from "next/server";

//login user
export async function POST(req: NextRequest) {
  return login(req);
}
