import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
config({ path: ".env" }); //or even .env.local

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
});
