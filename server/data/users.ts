import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import { getDb } from "../lib/db";
import type { GithubProfile } from "../lib/github";
import type { SessionUser } from "../types";

function mapUserToSessionUser(record: typeof users.$inferSelect): SessionUser {
  return {
    id: record.id,
    login: record.githubLogin,
    name: record.name,
    avatarUrl: record.avatarUrl,
    email: record.email,
  };
}

export async function upsertGithubUser(
  profile: GithubProfile
): Promise<SessionUser> {
  const db = getDb();

  const [record] = await db
    .insert(users)
    .values({
      id: randomUUID(),
      githubId: profile.githubId,
      githubLogin: profile.login,
      name: profile.name,
      email: profile.email,
      avatarUrl: profile.avatarUrl,
    })
    .onConflictDoUpdate({
      target: users.githubId,
      set: {
        githubLogin: profile.login,
        name: profile.name,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
      },
    })
    .returning();

  return mapUserToSessionUser(record);
}

export async function getUserById(userId: string): Promise<SessionUser | null> {
  const db = getDb();
  const [record] = await db.select().from(users).where(eq(users.id, userId));
  return record ? mapUserToSessionUser(record) : null;
}
