import type { Task } from "@homework/types/task.interface"

export interface InstanceDraft {
  instanceId: string
  resourceId: string
  resourceName: string
  instanceIndex: number
  capacityBefore: number
  capacity: number
}

export interface ResourceReporterState {
  task: Task
  drafts: InstanceDraft[]
  isLoading: boolean
}
