export type PurchaseRow = {
  id: string
  title: string
  amount: number
  month: string
  splitWith: string
  receiptUrl: string | null
  paidById: string
  paidBy: { name: string }
  createdAt: Date
}

export type PurchaseCreateData = {
  title: string
  amount: number
  month: string
  paidById: string
  splitWith: string
}
