// frontend/lib/api.ts

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;

  // 1. Check localStorage primary storage
  try {
    const localToken = localStorage.getItem('kisansetu_token');
    if (localToken && localToken.trim() !== '' && localToken !== 'null' && localToken !== 'undefined') {
      return localToken.trim();
    }
  } catch {}

  // 2. Check document cookie fallback
  try {
    if (typeof document !== 'undefined') {
      const match = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (match) {
        const val = match.split('=')[1];
        if (val && val.trim() !== '' && val !== 'null' && val !== 'undefined') {
          return val.trim();
        }
      }
    }
  } catch {}

  return null;
}

export function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && token.trim() !== '' ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API error: ${response.status}`);
  }

  return response.json();
}

