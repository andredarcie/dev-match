import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { serverConfig } from "../config";
import * as schema from "../db/schema";

let database: NeonHttpDatabase<typeof schema> | null = null;

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (!database) {
    const databaseUrl = serverConfig.databaseUrl();
    if (!databaseUrl) {
      throw new Error("Missing required environment variable: DATABASE_URL");
    }

    database = drizzle(neon(databaseUrl), { schema });
  }

  return database;
}
