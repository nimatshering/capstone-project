import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getTasks, store, update, destroy } from "@/models/TaskModel";

/* -----------------------------
   Zod Validations
----------------------------- */

// Create schema - all fields required
const createTaskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Task description is required"),
  status: z.string().min(1, "Task status is required"),
  projectId: z.string().uuid("Invalid project ID"),
  dueAt: z.coerce
    .date()
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: "Due date is required",
    }),
});

// Update schema - partial version for PATCH
const updateTaskSchema = createTaskSchema.partial();

// Utility to extract Zod field errors
function getZodFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path[0];
    if (typeof path === "string") {
      fieldErrors[path] = issue.message;
    }
  }
  return fieldErrors;
}

/* -----------------------------
   Controller Functions
----------------------------- */

// GET /tasks?projectId=uuid
export async function getAllTasks(projectId: string) {
  try {
    const tasks = await getTasks(projectId);
    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    console.error("Fetch tasks error:", err);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /tasks
export async function createTask(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { fieldErrors: getZodFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    const newTask = await store(parsed.data);

    return NextResponse.json(
      {
        message: "Task created successfully",
        task: newTask,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create task error:", err);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// PUT /tasks
export async function updateTask(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const parsed = updateTaskSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { fieldErrors: getZodFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    await update(id, parsed.data);

    return NextResponse.json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /tasks
export async function deleteTask(id: string) {
  try {
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    await destroy(id);
    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
