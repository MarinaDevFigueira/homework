import type { Purchase } from "@homework/types/purchase.interface"
import { apiRequest } from "~/lib/api.client"

async function create(data: {
  title: string
  amount: number
  month: string
  splitWithIds: string[]
}): Promise<Purchase | null> {
  const result = await apiRequest<Purchase>("/purchases", {
    method: "POST",
    body: JSON.stringify(data),
  })
  return result.data
}

export const purchasesService = { create }
