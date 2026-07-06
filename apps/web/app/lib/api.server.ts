const API_BASE = process.env.API_URL ?? "http://localhost:3001"

export async function apiFetch<T>(
  path: string,
  request: Request,
  options?: RequestInit,
): Promise<{ data: T | null; error: string | null }> {
  const cookieHeader = request.headers.get("Cookie") ?? ""
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
      ...(options?.headers ?? {}),
    },
  })

  const body = await response.json()
  return body as { data: T | null; error: string | null }
}
