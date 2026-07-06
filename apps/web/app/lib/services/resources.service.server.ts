import type { Resource } from "@homework/types/resource.interface"
import { apiFetch } from "~/lib/api.server"

export async function listResources(request: Request): Promise<Resource[]> {
  const result = await apiFetch<Resource[]>("/resources", request)
  return result.data ?? []
}
