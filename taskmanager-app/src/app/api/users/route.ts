import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/controllers/UserController";
import { NextRequest, NextResponse } from "next/server";

//get users
export async function GET() {
  return getAllUsers();
}
//create user
export async function POST(req: NextRequest) {
  return createUser(req);
}

// Update user
export async function PATCH(req: NextRequest) {
  return updateUser(req);
}

//delete User
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const result = await deleteUser(id);
  return NextResponse.json(result);
}
