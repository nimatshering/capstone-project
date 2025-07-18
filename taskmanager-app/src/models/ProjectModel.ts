import { Project, projectsTable } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { desc } from "drizzle-orm";

//function to get all ProjectsTable
export const getProjects = async () => {
  return await db
    .select()
    .from(projectsTable)
    .orderBy(desc(projectsTable.createdAt));
};

// Function to insert a Project into the database
export async function store(
  project: Omit<Project, "id" | "createdAt" | "updatedAt">
) {
  await db.insert(projectsTable).values({
    id: uuidv4(), // generate and assign UUID here
    ...project,
  });
}

//Function to update Project
export async function update(id: string, Project: Partial<Project>) {
  if (!id || Object.keys(Project).length === 0) {
    throw new Error("Invalid update input");
  }
  await db.update(projectsTable).set(Project).where(eq(projectsTable.id, id));
}

// Function to delete a Project
export const destroy = async (id: string) => {
  await db.delete(projectsTable).where(eq(projectsTable.id, id));
};
