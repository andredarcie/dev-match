import { saveProgressUpdate, getProgressSnapshot } from "../server/data/progress";
import { getCurrentUser } from "../server/auth/getCurrentUser";

interface ApiRequest {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface ApiResponse {
  status(code: number): {
    json(payload: unknown): void;
    end(): void;
  };
}

interface ProgressRequestBody {
  nodeId?: string;
  score?: number;
  total?: number;
  completed?: boolean;
}

function parseBody(body: unknown): ProgressRequestBody {
  if (typeof body === "string") {
    return JSON.parse(body) as ProgressRequestBody;
  }

  if (body && typeof body === "object") {
    return body as ProgressRequestBody;
  }

  return {};
}

export default async function handler(
  request: ApiRequest,
  response: ApiResponse
): Promise<void> {
  const authState = await getCurrentUser(request);
  if (!authState.authenticated) {
    response.status(401).json({
      authenticated: false,
      error: "unauthorized",
    });
    return;
  }

  if (request.method === "GET") {
    const snapshot = await getProgressSnapshot(authState.user.id);
    response.status(200).json(snapshot);
    return;
  }

  if (request.method === "POST") {
    const body = parseBody(request.body);

    if (
      typeof body.nodeId !== "string" ||
      typeof body.score !== "number" ||
      typeof body.total !== "number" ||
      typeof body.completed !== "boolean"
    ) {
      response.status(400).json({ error: "invalid_payload" });
      return;
    }

    const snapshot = await saveProgressUpdate({
      userId: authState.user.id,
      nodeId: body.nodeId,
      score: body.score,
      total: body.total,
      completed: body.completed,
    });

    response.status(200).json(snapshot);
    return;
  }

  response.status(405).end();
}
