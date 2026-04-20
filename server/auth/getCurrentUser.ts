import { serverConfig } from "../config";
import { getUserById } from "../data/users";
import { getCookie } from "../lib/cookies";
import { verifySessionToken } from "../lib/session";
import type { AuthState, RequestLike } from "../types";

export async function getCurrentUser(request: RequestLike): Promise<AuthState> {
  const token = getCookie(request, serverConfig.sessionCookieName);
  if (!token) {
    return { authenticated: false, user: null };
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return { authenticated: false, user: null };
  }

  const persistedUser = await getUserById(session.user.id).catch(() => null);
  if (!persistedUser) {
    return { authenticated: false, user: null };
  }

  return {
    authenticated: true,
    user: persistedUser,
  };
}
