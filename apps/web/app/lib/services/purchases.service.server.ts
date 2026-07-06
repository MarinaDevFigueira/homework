import type { Purchase } from "@homework/types/purchase.interface"
import { apiFetch } from "~/lib/api.server"

export async function listPurchases(request: Request, month?: string): Promise<Purchase[]> {
  const query = month ? `?month=${month}` : ""
  const result = await apiFetch<Purchase[]>(`/purchases${query}`, request)
  return result.data ?? []
}
