import { logoutUser } from "../../server/auth/logoutUser";

interface ApiResponse {
  setHeader(name: string, value: string | string[]): void;
  status(code: number): { end(): void };
}

export default async function handler(
  _request: unknown,
  response: ApiResponse
): Promise<void> {
  const result = logoutUser();
  response.setHeader("Set-Cookie", result.setCookie);
  response.status(204).end();
}
