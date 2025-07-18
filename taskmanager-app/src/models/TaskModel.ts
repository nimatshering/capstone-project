import { Task, tasksTable } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { desc } from "drizzle-orm";

// Get all tasks for a project, ordered by creation date descending
export const getTasks = async (projectId: string): Promise<Task[]> => {
  return await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.projectId, projectId))
    .orderBy(desc(tasksTable.createdAt));
};

// Insert a new task; returns the inserted task including id
export async function store(
  task: Omit<Task, "id" | "createdAt" | "updatedAt">
): Promise<Task> {
  const id = uuidv4();
  await db.insert(tasksTable).values({
    id,
    ...task,
  });
  // Optionally, fetch and return the inserted row
  const [newTask] = await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.id, id));
  return newTask;
}

// Update task by id with partial data
export async function update(id: string, task: Partial<Task>): Promise<void> {
  if (!id || Object.keys(task).length === 0) {
    throw new Error("Invalid update input");
  }
  await db.update(tasksTable).set(task).where(eq(tasksTable.id, id));
}

// Delete task by id
export const destroy = async (id: string): Promise<void> => {
  await db.delete(tasksTable).where(eq(tasksTable.id, id));
};
