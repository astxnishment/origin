"use client";

/**
 * auth — client-side auth scaffold.
 *
 * Front-end only for now: the "session" lives in localStorage so the UI is
 * fully functional. Every entry point (signIn / signUp / signInWithGoogle /
 * signOut) is async and isolated here so swapping in a real backend
 * (NextAuth, Supabase, custom API) only touches this file.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface AuthUser {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  /** true until the stored session has been read (avoids UI flicker) */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (name: string, email: string, password: string) => Promise<AuthUser>;
  signInWithGoogle: () => Promise<AuthUser>;
  signOut: () => void;
}

const STORAGE_KEY = "origin-auth-user";

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    return parsed?.email ? parsed : null;
  } catch {
    return null;
  }
}

/** Simulated network latency so loading states are visible & testable. */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readStoredUser());
    setLoading(false);
  }, []);

  const persist = useCallback((u: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const signIn = useCallback(
    async (email: string, _password: string) => {
      // TODO(backend): POST /api/auth/login
      await delay(700);
      const name = email
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return persist({ name, email });
    },
    [persist]
  );

  const signUp = useCallback(
    async (name: string, email: string, _password: string) => {
      // TODO(backend): POST /api/auth/register
      await delay(900);
      return persist({ name, email });
    },
    [persist]
  );

  const signInWithGoogle = useCallback(async () => {
    // TODO(backend): trigger OAuth flow (e.g. NextAuth signIn("google"))
    await delay(800);
    return persist({ name: "Google User", email: "user@gmail.com" });
  }, [persist]);

  const signOut = useCallback(() => {
    // TODO(backend): POST /api/auth/logout
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
