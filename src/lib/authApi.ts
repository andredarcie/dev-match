import type { AuthState } from "../auth";

export async function fetchAuthState(): Promise<AuthState> {
  const response = await fetch("/api/me", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch auth state: ${response.status}`);
  }

  return (await response.json()) as AuthState;
}

export async function logout(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to logout: ${response.status}`);
  }
}
