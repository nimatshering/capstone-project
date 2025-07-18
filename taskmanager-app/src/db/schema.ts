import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";
import { createdAt, id, updatedAt } from "./schemaHelpers";
import { relations, sql } from "drizzle-orm";

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

// Projects table
export const projectsTable = mysqlTable("projects", {
  id,
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  createdBy: varchar("created_by", { length: 255 })
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdAt,
  updatedAt,
});

// Tasks table
export const tasksTable = mysqlTable("tasks", {
  id,
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  status: varchar("status", { length: 255 }).notNull().default("created"),
  projectId: varchar("project_id", { length: 255 })
    .notNull()
    .references(() => projectsTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  dueAt: timestamp("due_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  createdAt,
  updatedAt,
});

// Relations - one-to-many relationship between users and projects
export const userProjectsRelations = relations(usersTable, ({ many }) => ({
  projects: many(projectsTable),
}));

// Relations - one-to-many relationship between projects and tasks
export const projectTasksRelations = relations(projectsTable, ({ many }) => ({
  tasks: many(tasksTable),
}));

// Export type-safe User model inferred from usersTable (Drizzle ORM)
export type User = typeof usersTable.$inferSelect;
export type Task = typeof tasksTable.$inferSelect;
export type Project = typeof projectsTable.$inferSelect;
