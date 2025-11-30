const normalizeBaseUrl = (rawBase) => {
  if (!rawBase) return null;
  return rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
};

const browserApiUrl = typeof window !== 'undefined' ? window.__MELODY_API_URL__ : undefined;
const browserHost = typeof window !== 'undefined' ? window.location.hostname : '';
const isDeployedHost = browserHost && browserHost.includes('vercel.app');

const API_BASE_URL =
  normalizeBaseUrl(import.meta.env.VITE_API_URL) ||
  normalizeBaseUrl(browserApiUrl) ||
  (isDeployedHost ? 'https://melody-be-fawn.vercel.app' : 'http://localhost:4000');

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
    throw new Error(message);
  }

  return payload;
};

export const register = (data) =>
  request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const login = (data) =>
  request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const apiBaseUrl = API_BASE_URL;
