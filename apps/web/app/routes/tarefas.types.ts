import type { Task } from "@homework/types/task.interface"

export interface InstanceDraft {
  instanceId: string
  resourceName: string
  instanceIndex: number
  capacity: number
}

export interface ResourceReporterState {
  task: Task
  drafts: InstanceDraft[]
  isLoading: boolean
}
