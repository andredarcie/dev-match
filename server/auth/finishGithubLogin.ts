import { serverConfig } from "../config";
import { upsertGithubUser } from "../data/users";
import { clearCookie, createCookie, getCookie } from "../lib/cookies";
import {
  exchangeCodeForAccessToken,
  fetchGithubProfile,
} from "../lib/github";
import { buildSessionPayload, createSessionToken } from "../lib/session";
import type { RequestLike } from "../types";

export class OAuthCallbackError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(code);
    this.code = code;
  }
}

export async function finishGithubLogin(request: RequestLike): Promise<{
  redirectTo: string;
  setCookie: string[];
}> {
  const code = request.query?.code;
  const state = request.query?.state;

  if (typeof code !== "string" || !code) {
    throw new OAuthCallbackError("oauth_code_missing");
  }

  if (typeof state !== "string" || !state) {
    throw new OAuthCallbackError("oauth_state_missing");
  }

  const storedState = getCookie(request, serverConfig.oauthStateCookieName);
  if (!storedState || storedState !== state) {
    throw new OAuthCallbackError("oauth_state_invalid");
  }

  let accessToken: string;
  try {
    accessToken = await exchangeCodeForAccessToken(code);
  } catch {
    throw new OAuthCallbackError("oauth_exchange_failed");
  }

  let user;
  try {
    const githubProfile = await fetchGithubProfile(accessToken);
    user = await upsertGithubUser(githubProfile);
  } catch {
    throw new OAuthCallbackError("oauth_profile_failed");
  }

  const token = await createSessionToken(buildSessionPayload(user));

  return {
    redirectTo: serverConfig.appUrl(),
    setCookie: [
      createCookie(serverConfig.sessionCookieName, token, {
        maxAge: serverConfig.sessionDurationSeconds,
      }),
      clearCookie(serverConfig.oauthStateCookieName),
    ],
  };
}
