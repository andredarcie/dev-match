import { serverConfig } from "../config";
import { clearCookie } from "../lib/cookies";

export function logoutUser(): { setCookie: string[] } {
  return {
    setCookie: [clearCookie(serverConfig.sessionCookieName)],
  };
}
