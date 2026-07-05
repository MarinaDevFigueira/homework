export interface Purchase {
  id: string
  title: string
  amount: number
  month: string
  paidById: string
  paidByName: string
  splitWithIds: string[]
  receiptUrl: string | null
  createdAt: string
}

export interface CreatePurchaseInput {
  title: string
  amount: number
  month: string
  paidById: string
  splitWithIds: string[]
}
