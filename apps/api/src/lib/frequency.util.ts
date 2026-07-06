import { RecurringFrequency } from '@homework/types/recurring.enum'

const FREQUENCY_DAYS: Record<RecurringFrequency, number> = {
  [RecurringFrequency.Daily]: 1,
  [RecurringFrequency.Weekly]: 7,
  [RecurringFrequency.Biweekly]: 14,
  [RecurringFrequency.Monthly]: 30,
}

export function getFrequencyDays(frequency: RecurringFrequency): number {
  return FREQUENCY_DAYS[frequency]
}

export function calculateNextDue(currentNextDue: Date, frequencyDays: number): Date {
  const nextDue = new Date(currentNextDue)
  nextDue.setDate(nextDue.getDate() + frequencyDays)
  return nextDue
}
