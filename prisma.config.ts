import "dotenv/config";
import { defineConfig } from "prisma/config";

const localDatabaseUrl =
  "postgresql://postgres:postgres@localhost:5432/fireside_chat?schema=public";

const databaseUrl = process.env.DATABASE_URL ?? localDatabaseUrl;

if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be configured in production");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
