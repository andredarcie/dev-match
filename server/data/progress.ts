import { and, eq } from "drizzle-orm";
import { userProgress } from "../db/schema";
import { getDb } from "../lib/db";

export interface ProgressSnapshot {
  completedNodeIds: string[];
}

export interface ProgressUpdateInput {
  userId: string;
  nodeId: string;
  score: number;
  total: number;
  completed: boolean;
}

export async function getProgressSnapshot(
  userId: string
): Promise<ProgressSnapshot> {
  const db = getDb();
  const rows = await db
    .select({
      nodeId: userProgress.nodeId,
      completed: userProgress.completed,
    })
    .from(userProgress)
    .where(eq(userProgress.userId, userId));

  return {
    completedNodeIds: rows
      .filter((row) => row.completed)
      .map((row) => row.nodeId),
  };
}

export async function saveProgressUpdate(
  input: ProgressUpdateInput
): Promise<ProgressSnapshot> {
  const db = getDb();

  const [existing] = await db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, input.userId),
        eq(userProgress.nodeId, input.nodeId)
      )
    );

  if (existing) {
    await db
      .update(userProgress)
      .set({
        attempts: existing.attempts + 1,
        bestScore: Math.max(existing.bestScore, input.score),
        completed: existing.completed || input.completed,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(userProgress.userId, input.userId),
          eq(userProgress.nodeId, input.nodeId)
        )
      );
  } else {
    await db.insert(userProgress).values({
      userId: input.userId,
      nodeId: input.nodeId,
      attempts: 1,
      bestScore: input.score,
      completed: input.completed,
      updatedAt: new Date(),
    });
  }

  return getProgressSnapshot(input.userId);
}
