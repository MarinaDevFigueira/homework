const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<{ data: T | null; error: string | null }> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  })

  const body = await response.json()
  return body as { data: T | null; error: string | null }
}
