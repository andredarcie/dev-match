import { randomBytes } from "node:crypto";
import { serverConfig } from "../config";

interface AccessTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GithubUserResponse {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string | null;
  email: string | null;
}

interface GithubEmailResponse {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

export interface GithubProfile {
  githubId: number;
  login: string;
  name: string | null;
  avatarUrl: string | null;
  email: string | null;
}

function getRedirectUri(): string {
  return `${serverConfig.appUrl()}/api/auth/github-callback`;
}

export function generateOauthState(): string {
  return randomBytes(24).toString("hex");
}

export function buildGithubAuthorizeUrl(state: string): string {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", serverConfig.githubClientId());
  url.searchParams.set("redirect_uri", getRedirectUri());
  url.searchParams.set("scope", "read:user user:email");
  url.searchParams.set("state", state);
  return url.toString();
}

export async function exchangeCodeForAccessToken(
  code: string
): Promise<string> {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: serverConfig.githubClientId(),
      client_secret: serverConfig.githubClientSecret(),
      code,
      redirect_uri: getRedirectUri(),
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub token exchange failed with ${response.status}`);
  }

  const payload = (await response.json()) as AccessTokenResponse;
  if (!payload.access_token) {
    throw new Error(
      payload.error_description ?? payload.error ?? "Missing access token"
    );
  }

  return payload.access_token;
}

async function githubFetch<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "archpull",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${path} failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchGithubProfile(
  accessToken: string
): Promise<GithubProfile> {
  const profile = await githubFetch<GithubUserResponse>("/user", accessToken);
  const emails = await githubFetch<GithubEmailResponse[]>(
    "/user/emails",
    accessToken
  ).catch(() => []);

  const primaryEmail =
    emails.find((email) => email.primary && email.verified)?.email ??
    profile.email;

  return {
    githubId: profile.id,
    login: profile.login,
    name: profile.name,
    avatarUrl: profile.avatar_url,
    email: primaryEmail ?? null,
  };
}
