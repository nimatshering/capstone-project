import { User, usersTable } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { desc } from "drizzle-orm";

//function to get all usersTable
export const getUsers = async () => {
  return await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
};

// Function to insert a User into the database
export async function store(
  user: Omit<User, "id" | "createdAt" | "updatedAt">
) {
  await db.insert(usersTable).values({
    id: uuidv4(), // generate and assign UUID here
    ...user,
  });
}

//Function to update User
export async function update(id: string, user: Partial<User>) {
  if (!id || Object.keys(user).length === 0) {
    throw new Error("Invalid update input");
  }
  await db.update(usersTable).set(user).where(eq(usersTable.id, id));
}

// Function to delete a User
export const destroy = async (id: string) => {
  await db.delete(usersTable).where(eq(usersTable.id, id));
};
