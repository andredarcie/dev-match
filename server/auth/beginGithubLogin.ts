import { serverConfig } from "../config";
import { createCookie } from "../lib/cookies";
import { buildGithubAuthorizeUrl, generateOauthState } from "../lib/github";

export interface RedirectInstruction {
  location: string;
  setCookie?: string[];
}

export function beginGithubLogin(): RedirectInstruction {
  const state = generateOauthState();
  const stateCookie = createCookie(serverConfig.oauthStateCookieName, state, {
    maxAge: serverConfig.oauthStateDurationSeconds,
  });

  return {
    location: buildGithubAuthorizeUrl(state),
    setCookie: [stateCookie],
  };
}
