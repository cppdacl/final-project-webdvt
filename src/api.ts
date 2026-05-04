const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export const api =
    async (path: string, options: RequestInit = {}, username?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const u = username ?? localStorage.getItem('gb_username');
  if (u) headers['x-username'] = u;

  const res = await fetch(`${BASE}${path}`, {...options, headers});
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Request failed');
  return data;
};