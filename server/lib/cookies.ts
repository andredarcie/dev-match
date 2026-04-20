import { parse, serialize, type SerializeOptions } from "cookie";
import { serverConfig } from "../config";
import type { RequestLike } from "../types";

function getCookieHeader(request: RequestLike): string {
  const cookieHeader = request.headers?.cookie ?? request.headers?.Cookie;
  return Array.isArray(cookieHeader) ? cookieHeader.join("; ") : cookieHeader ?? "";
}

export function readCookies(request: RequestLike): Record<string, string> {
  const parsed = parse(getCookieHeader(request));
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === "string") {
      result[key] = value;
    }
  }

  return result;
}

export function getCookie(
  request: RequestLike,
  name: string
): string | undefined {
  return readCookies(request)[name];
}

export function createCookie(
  name: string,
  value: string,
  options: SerializeOptions = {}
): string {
  return serialize(name, value, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: serverConfig.isProduction,
    ...options,
  });
}

export function clearCookie(name: string): string {
  return createCookie(name, "", {
    maxAge: 0,
    expires: new Date(0),
  });
}
