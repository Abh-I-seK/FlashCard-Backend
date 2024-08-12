import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  dialect: "mysql",
  schema: "./dist/schema.js",
  out: "./drizzle",
  dbCredentials:{
    url: process.env.DATABASE_URL as string,
  }
});