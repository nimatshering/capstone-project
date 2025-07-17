// models/LoginModel.ts
import { db } from "@/db/drizzle";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function findUserByUsername(username: string) {
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  return result[0]; // returns undefined if not found
}
