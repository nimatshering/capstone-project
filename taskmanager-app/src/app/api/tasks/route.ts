import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/controllers/TaskController";
import { NextRequest, NextResponse } from "next/server";

// Get Tasks by projectId from searchParams
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }
  return await getAllTasks(projectId);
}

// Create Task
export async function POST(req: NextRequest) {
  return await createTask(req);
}

// Update Task
export async function PUT(req: NextRequest) {
  return await updateTask(req);
}

// Delete Task
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const result = await deleteTask(id);
  return NextResponse.json(result, { status: result.status });
}
