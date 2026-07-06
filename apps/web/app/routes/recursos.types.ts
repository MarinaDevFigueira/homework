import type { Resource } from "@homework/types/resource.interface"

export interface ResourceCardViewProps {
  resource: Resource
  onAddInstance: (resourceId: string) => void
}
