import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/controllers/ProjectController";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

//get Projects
export async function GET() {
  return getAllProjects();
}

// export async function GET(req: Request) {
//   const token = req.headers.get("Authorization")?.replace("Bearer ", "") || "";
//   const user = await decrypt(token);
//   if (!user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   return getAllProjects();
// }

//create Project
export async function POST(req: NextRequest) {
  return createProject(req);
}

// Update Project
export async function PATCH(req: NextRequest) {
  return updateProject(req);
}

//delete Project
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const result = await deleteProject(id);
  return NextResponse.json(result);
}
