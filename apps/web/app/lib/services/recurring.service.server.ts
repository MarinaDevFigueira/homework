import type { RecurringTemplate } from "@homework/types/recurring.interface"
import { apiFetch } from "~/lib/api.server"

export async function listRecurring(request: Request): Promise<RecurringTemplate[]> {
  const result = await apiFetch<RecurringTemplate[]>("/recurring", request)
  return result.data ?? []
}
