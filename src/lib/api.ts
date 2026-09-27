// Same-origin API client. Route Handlers under src/app/api are deployed with
// the app, so the browser never needs a separately hosted API URL.
const BASE = '/api';

async function req<T>(endpoint: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${endpoint}`, {
    ...opts,
    credentials: 'same-origin',
    headers: {
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
      ...opts.headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data as T;
}

type ApiResponse<T> = { success: boolean; message?: string; data: T };
type AuthData = { user: Record<string, unknown>; token: string };

export const authApi = {
  register: (b: { name: string; email: string; password: string; phone?: string; role?: string; location?: string; bio?: string; skills?: string[] }) =>
    req<ApiResponse<AuthData>>('/auth', { method: 'POST', body: JSON.stringify({ ...b, action: 'register' }) }),
  login: (b: { email: string; password: string }) =>
    req<ApiResponse<AuthData>>('/auth', { method: 'POST', body: JSON.stringify({ ...b, action: 'login' }) }),
  me: () => req<ApiResponse<{ user: Record<string, unknown> }>>('/auth'),
  logout: () => req<ApiResponse<{}>>('/auth', { method: 'POST', body: JSON.stringify({ action: 'logout' }) }),
};

// Authentication is held in the server-set, HttpOnly bf_token cookie.
// Kept as a migration shim for existing UI imports; it intentionally stores no token.
export const tokenHelpers = {
  set: (_token: string) => undefined,
  get: () => null,
  clear: () => undefined,
};

export const contactApi = {
  send: (body: { name: string; email: string; subject: string; message: string }) =>
    req<ApiResponse<{ id: string }>>('/contact', { method: 'POST', body: JSON.stringify(body) }),
};

export const quotesApi = {
  create: (body: Record<string, unknown>) =>
    req<ApiResponse<{ quote: Record<string, unknown> }>>('/quotes', { method: 'POST', body: JSON.stringify(body) }),
};

export const servicesApi = {
  list: () => req<ApiResponse<{ services: unknown[] }>>('/services'),
};

export const ordersApi = {
  list: (params?: Record<string, string>) => req<ApiResponse<{ orders: unknown[] }>>(`/orders${params ? `?${new URLSearchParams(params)}` : ''}`),
  create: (body: Record<string, unknown>) => req<ApiResponse<{ order: Record<string, unknown> }>>('/orders', { method: 'POST', body: JSON.stringify(body) }),
};
