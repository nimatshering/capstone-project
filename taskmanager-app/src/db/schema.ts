import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { createdAt, id, updatedAt } from "./schemaHelpers";

// Users table
export const usersTable = mysqlTable("users", {
  id,
  fullname: varchar("fullname", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  photo: varchar("photo", { length: 255 }),
  createdAt,
  updatedAt,
});

// Export type-safe User model inferred from usersTable (Drizzle ORM)
export type User = typeof usersTable.$inferSelect;
