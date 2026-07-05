export interface Resource {
  id: string
  name: string
  type: string
  capacity: number
  location: string | null
  createdById: string
  createdAt: string
}

export interface ResourceBooking {
  id: string
  resourceId: string
  taskId: string | null
  userId: string
  startAt: string
  endAt: string
}

export interface UpdateCapacityInput {
  capacity: number
}
