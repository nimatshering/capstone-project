import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getProjects, store, update, destroy } from "@/models/ProjectModel";
import { getSession } from "@/lib/session";

/* -----------------------------------
   ZOD validations
----------------------------------- */

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  createdBy: z.string().optional(),
});

// Update project schema
const updateProjectSchema = createProjectSchema.partial();

//  field-level errors
function getZodFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  error.issues.forEach((e) => {
    const path = e.path.join(".");
    fieldErrors[path] = e.message;
  });
  return fieldErrors;
}

/* -------------------------------
   Controllers actions
------------------------------- */

// GET - /api/projects
export async function getAllProjects() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects, { status: 200 });
  } catch (err) {
    console.error("Get projects error:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST - /api/projects
export async function createProject(req: NextRequest) {
  try {
    const session = await getSession(req);
    console.log(session);
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { fieldErrors: getZodFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    const newProject = await store({
      ...parsed.data,
      createdBy: session.userId,
    });
    console.log("session.userId:", session.userId);

    return NextResponse.json(
      { message: "Project created successfully", project: newProject },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create project error:", err);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// PUT - /api/projects
export async function updateProject(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const parsed = updateProjectSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { fieldErrors: getZodFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    await update(id, parsed.data);

    return NextResponse.json({ message: "Project updated successfully" });
  } catch (err) {
    console.error("Update project error:", err);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE - /api/projects?id=123
export async function deleteProject(id: string) {
  try {
    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    await destroy(id);

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete project error:", err);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
