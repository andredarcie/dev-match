import { beginGithubLogin } from "../../server/auth/beginGithubLogin";

interface ApiResponse {
  setHeader(name: string, value: string | string[]): void;
  redirect(statusCode: number, location: string): void;
}

export default async function handler(
  _request: unknown,
  response: ApiResponse
): Promise<void> {
  const result = beginGithubLogin();
  if (result.setCookie) {
    response.setHeader("Set-Cookie", result.setCookie);
  }
  response.redirect(302, result.location);
}
