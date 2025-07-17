import { varchar, timestamp } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const id = varchar("id", { length: 255 }).primaryKey();

export const createdAt = timestamp("created_at", { mode: "date" })
  .notNull()
  .default(sql`CURRENT_TIMESTAMP`);

export const updatedAt = timestamp("updated_at", { mode: "date" })
  .notNull()
  .default(sql`CURRENT_TIMESTAMP`)
  .onUpdateNow();
