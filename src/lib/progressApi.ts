export interface ProgressSnapshot {
  completedNodeIds: string[];
}

interface ProgressUpdatePayload {
  nodeId: string;
  score: number;
  total: number;
  completed: boolean;
}

export async function fetchProgressSnapshot(): Promise<ProgressSnapshot> {
  const response = await fetch("/api/progress", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch progress: ${response.status}`);
  }

  return (await response.json()) as ProgressSnapshot;
}

export async function saveProgressUpdate(
  payload: ProgressUpdatePayload
): Promise<ProgressSnapshot> {
  const response = await fetch("/api/progress", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to save progress: ${response.status}`);
  }

  return (await response.json()) as ProgressSnapshot;
}
