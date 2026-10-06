'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export interface AuthUser {
  _id: string;
  name: string;
  role: 'client' | 'freelancer' | 'admin';
  wallet?: string;
  [key: string]: unknown;
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const refresh = useCallback(async () => {
    setStatus('loading');
    try {
      const response = await fetch('/api/auth', {
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      const payload: unknown = await response.json().catch(() => null);
      const data = typeof payload === 'object' && payload !== null ? (payload as { data?: { user?: AuthUser } }).data : undefined;
      if (!response.ok || !data?.user?._id) {
        setUser(null);
        setStatus('unauthenticated');
        return;
      }
      setUser(data.user);
      setStatus('authenticated');
    } catch {
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await fetch('/api/auth', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  return <AuthContext.Provider value={{ user, status, refresh, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider.');
  return value;
}

export function RequireAuth({ children, roles }: { children: ReactNode; roles?: AuthUser['role'][] }) {
  const { user, status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      const returnTo = encodeURIComponent(pathname || '/dashboard');
      router.replace(`/login?returnTo=${returnTo}`);
      return;
    }
    if (status === 'authenticated' && roles && user && !roles.includes(user.role)) {
      router.replace('/dashboard');
    }
  }, [pathname, router, roles, status, user]);

  if (status !== 'authenticated' || !user || (roles && !roles.includes(user.role))) {
    return <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', color: 'var(--text-secondary)' }} aria-live="polite">Checking your session…</main>;
  }

  return <>{children}</>;
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const { user, status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'authenticated' || !user) return;
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('returnTo');
    const destination = requested?.startsWith('/') && !requested.startsWith('//') ? requested : '/dashboard';
    router.replace(destination);
  }, [pathname, router, status, user]);

  if (status === 'loading' || status === 'authenticated') {
    return <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', color: 'var(--text-secondary)' }} aria-live="polite">Checking your session…</main>;
  }
  return <>{children}</>;
}
