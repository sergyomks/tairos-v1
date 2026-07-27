import { supabase } from './supabase';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getAuthHeaders(includeJson = true): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = {
    // Evita la página de aviso de ngrok (gratis) que rompe las respuestas JSON
    'ngrok-skip-browser-warning': 'true',
  };
  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  return headers;
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const authHeaders = await getAuthHeaders(true);
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...authHeaders,
      ...(options.headers || {}),
    },
  });
}

export async function apiUpload(path: string, file: File): Promise<Response> {
  const headers = await getAuthHeaders(false);
  const formData = new FormData();
  formData.append('file', file);

  return fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });
}
