import { useEffect, useState } from "react"
import { useLoaderData } from "react-router"
import type { LoaderFunctionArgs } from "react-router"
import type { Purchase } from "@homework/types/purchase.interface"
import { listPurchases } from "~/lib/services/purchases.service.server"
import { purchasesService } from "~/lib/services/purchases.service"
import { authStore } from "~/lib/stores/auth.store"
import { PageHeader, PageHeaderContent, PageHeaderTitle, PageHeaderSubtitle, PageHeaderAction } from "~/components/ui/page-header"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "~/components/ui/dialog"
import { EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription } from "~/components/ui/empty-state"

export async function loader({ request }: LoaderFunctionArgs) {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const purchases = await listPurchases(request, currentMonth)
  return { purchases }
}

export default function Compras() {
  const { purchases: loaderPurchases } = useLoaderData<typeof loader>()
  const [purchases, setPurchases] = useState<Purchase[]>(loaderPurchases)
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newAmount, setNewAmount] = useState("")
  const [newMonth, setNewMonth] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    setPurchases(loaderPurchases)
  }, [loaderPurchases])

  async function handleCreate() {
    const isTitleEmpty = newTitle.trim() === ""
    const isAmountEmpty = newAmount.trim() === ""
    if (isTitleEmpty || isAmountEmpty) return

    const amount = parseFloat(newAmount)
    const isValidAmount = !isNaN(amount) && amount > 0
    if (!isValidAmount) return

    const currentUser = authStore.state
    const hasCurrentUser = !!currentUser
    if (!hasCurrentUser) return

    const created = await purchasesService.create({
      title: newTitle.trim(),
      amount,
      month: newMonth,
      splitWithIds: [],
    })

    const isSuccess = !!created
    if (isSuccess) {
      setPurchases([...purchases, created])
      setNewTitle("")
      setNewAmount("")
      setNewMonth(new Date().toISOString().slice(0, 7))
      setIsCreating(false)
    }
  }

  const total = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)
  const formattedTotal = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  const hasPurchases = purchases.length > 0

  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Compras do Mês</PageHeaderTitle>
          <PageHeaderSubtitle>Total: {formattedTotal}</PageHeaderSubtitle>
        </PageHeaderContent>
        <PageHeaderAction>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger render={<Button size="sm" />}>+ Nova Compra</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Compra</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <Input
                  placeholder="Título da compra"
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Valor"
                  step="0.01"
                  value={newAmount}
                  onChange={(event) => setNewAmount(event.target.value)}
                />
                <Input
                  type="month"
                  value={newMonth}
                  onChange={(event) => setNewMonth(event.target.value)}
                />
              </div>
              <DialogFooter>
                <Button size="sm" onClick={handleCreate}>Criar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeaderAction>
      </PageHeader>

      {hasPurchases ? (
        <div className="flex flex-col gap-2.5">
          {purchases.map((purchase) => {
            const formattedAmount = purchase.amount.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
            return (
              <div key={purchase.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{purchase.title}</h3>
                  <span className="font-semibold">{formattedAmount}</span>
                </div>
                <p className="text-sm text-muted-foreground">Pago por: {purchase.paidByName}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState>
          <EmptyStateIcon>🛒</EmptyStateIcon>
          <EmptyStateTitle>Nenhuma compra encontrada</EmptyStateTitle>
          <EmptyStateDescription>Registre sua primeira compra do mês.</EmptyStateDescription>
        </EmptyState>
      )}
    </>
  )
}
