export enum RecurringFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Biweekly = 'biweekly',
  Monthly = 'monthly',
}

export interface RecurringTemplate {
  id: string
  title: string
  description: string | null
  assignedToId: string
  assignedToName: string
  frequency: RecurringFrequency
  nextDue: string
  isActive: boolean
  createdAt: string
}

export interface CreateRecurringInput {
  title: string
  description?: string
  assignedToId: string
  frequency: RecurringFrequency
  startDate: string
}
