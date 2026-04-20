export interface SessionUser {
  id: string;
  login: string;
  name: string | null;
  avatarUrl: string | null;
  email: string | null;
}

export interface SessionPayload {
  user: SessionUser;
  issuedAt: number;
  expiresAt: number;
}

export type AuthState =
  | { authenticated: true; user: SessionUser }
  | { authenticated: false; user: null };

export interface RequestLike {
  headers?: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
}
