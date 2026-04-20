import { getCurrentUser } from "../server/auth/getCurrentUser";

interface ApiRequest {
  headers?: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  status(code: number): { json(payload: unknown): void };
}

export default async function handler(
  request: ApiRequest,
  response: ApiResponse
): Promise<void> {
  const authState = await getCurrentUser(request);
  response.status(200).json(authState);
}
