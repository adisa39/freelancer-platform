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

export const authApi = {
  interlinkLogin: (body: { webToken: string; role: 'client' | 'freelancer'; profile?: { name?: string; location?: string; bio?: string; skills?: string[] } }) =>
    req<ApiResponse<{ user: Record<string, unknown> }>>('/auth', { method: 'POST', body: JSON.stringify({ ...body, action: 'interlink' }) }),
  me: () => req<ApiResponse<{ user: Record<string, unknown> }>>('/auth'),
  logout: () => req<ApiResponse<{}>>('/auth', { method: 'POST', body: JSON.stringify({ action: 'logout' }) }),
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
