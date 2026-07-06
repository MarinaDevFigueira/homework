import type { RecurringTemplate } from "@homework/types/recurring.interface"
import type { RecurringFrequency } from "@homework/types/recurring.enum"
import { apiRequest } from "~/lib/api.client"

async function create(data: {
  title: string
  description?: string
  assignedToId: string
  frequency: RecurringFrequency
  startDate: string
}): Promise<RecurringTemplate | null> {
  const result = await apiRequest<RecurringTemplate>("/recurring", {
    method: "POST",
    body: JSON.stringify(data),
  })
  return result.data
}

async function toggle(id: string, isActive: boolean): Promise<RecurringTemplate | null> {
  const result = await apiRequest<RecurringTemplate>(`/recurring/${id}`, {
    method: "PUT",
    body: JSON.stringify({ isActive }),
  })
  return result.data
}

export const recurringService = { create, toggle }
