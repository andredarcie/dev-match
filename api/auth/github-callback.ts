import {
  finishGithubLogin,
  OAuthCallbackError,
} from "../../server/auth/finishGithubLogin";

interface ApiRequest {
  headers?: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  setHeader(name: string, value: string | string[]): void;
  redirect(statusCode: number, location: string): void;
}

export default async function handler(
  request: ApiRequest,
  response: ApiResponse
): Promise<void> {
  try {
    const result = await finishGithubLogin(request);
    response.setHeader("Set-Cookie", result.setCookie);
    response.redirect(302, result.redirectTo);
  } catch (error) {
    const errorCode =
      error instanceof OAuthCallbackError
        ? error.code
        : "oauth_unknown_error";
    response.redirect(302, `/?authError=${encodeURIComponent(errorCode)}`);
  }
}
