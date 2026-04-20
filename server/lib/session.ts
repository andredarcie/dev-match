import { SignJWT, jwtVerify } from "jose";
import { serverConfig } from "../config";
import type { SessionPayload } from "../types";

const encoder = new TextEncoder();

function getSecretKey(): Uint8Array {
  return encoder.encode(serverConfig.sessionSecret());
}

export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({ user: payload.user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(payload.issuedAt)
    .setExpirationTime(payload.expiresAt)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const user = payload.user;
    const issuedAt = payload.iat;
    const expiresAt = payload.exp;

    if (
      !user ||
      typeof issuedAt !== "number" ||
      typeof expiresAt !== "number"
    ) {
      return null;
    }

    return {
      user: user as SessionPayload["user"],
      issuedAt,
      expiresAt,
    };
  } catch {
    return null;
  }
}

export function buildSessionPayload(
  user: SessionPayload["user"]
): SessionPayload {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + serverConfig.sessionDurationSeconds;
  return {
    user,
    issuedAt,
    expiresAt,
  };
}
