import { useEffect, useState } from "react"
import { useLoaderData } from "react-router"
import type { LoaderFunctionArgs } from "react-router"
import type { RecurringTemplate } from "@homework/types/recurring.interface"
import type { RecurringFrequency } from "@homework/types/recurring.enum"
import { RecurringFrequency as RecurringFrequencyEnum } from "@homework/types/recurring.enum"
import { listRecurring } from "~/lib/services/recurring.service.server"
import { recurringService } from "~/lib/services/recurring.service"
import { authStore } from "~/lib/stores/auth.store"
import { cn } from "~/lib/utils"
import { PageHeader, PageHeaderContent, PageHeaderTitle, PageHeaderAction } from "~/components/ui/page-header"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "~/components/ui/dialog"
import { StatusBadge } from "~/components/ui/status-badge"
import { EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription } from "~/components/ui/empty-state"

export async function loader({ request }: LoaderFunctionArgs) {
  const templates = await listRecurring(request)
  return { templates }
}

function frequencyToLabel(frequency: RecurringFrequency): string {
  const frequencyLabels: Record<RecurringFrequency, string> = {
    [RecurringFrequencyEnum.Daily]: "Diário",
    [RecurringFrequencyEnum.Weekly]: "Semanal",
    [RecurringFrequencyEnum.Biweekly]: "Quinzenal",
    [RecurringFrequencyEnum.Monthly]: "Mensal",
  }
  return frequencyLabels[frequency]
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

export default function Recorrentes() {
  const { templates: loaderTemplates } = useLoaderData<typeof loader>()
  const [templates, setTemplates] = useState<RecurringTemplate[]>(loaderTemplates)
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newFrequency, setNewFrequency] = useState<RecurringFrequency>(
    RecurringFrequencyEnum.Monthly,
  )
  const [newStartDate, setNewStartDate] = useState(
    new Date().toISOString().split("T")[0],
  )

  useEffect(() => {
    setTemplates(loaderTemplates)
  }, [loaderTemplates])

  async function handleCreate() {
    const isTitleEmpty = newTitle.trim() === ""
    if (isTitleEmpty) return

    const currentUser = authStore.state
    const hasCurrentUser = !!currentUser
    if (!hasCurrentUser) return

    const created = await recurringService.create({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      assignedToId: currentUser.id,
      frequency: newFrequency,
      startDate: newStartDate,
    })

    const isSuccess = !!created
    if (isSuccess) {
      setTemplates([...templates, created])
      setNewTitle("")
      setNewDescription("")
      setNewFrequency(RecurringFrequencyEnum.Monthly)
      setNewStartDate(new Date().toISOString().split("T")[0])
      setIsCreating(false)
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    const updated = await recurringService.toggle(id, !isActive)
    const isSuccess = !!updated
    if (isSuccess) {
      const nextTemplates = templates.map((template) => {
        const isMatch = template.id === id
        return isMatch ? updated : template
      })
      setTemplates(nextTemplates)
    }
  }

  const hasTemplates = templates.length > 0

  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Recorrências</PageHeaderTitle>
        </PageHeaderContent>
        <PageHeaderAction>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger render={<Button size="sm" />}>+ Nova Recorrência</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Recorrência</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <Input
                  placeholder="Título"
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                />
                <Input
                  placeholder="Descrição (opcional)"
                  value={newDescription}
                  onChange={(event) => setNewDescription(event.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium mb-1">Frequência</label>
                  <select
                    value={newFrequency}
                    onChange={(event) =>
                      setNewFrequency(event.target.value as RecurringFrequency)
                    }
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value={RecurringFrequencyEnum.Daily}>Diário</option>
                    <option value={RecurringFrequencyEnum.Weekly}>Semanal</option>
                    <option value={RecurringFrequencyEnum.Biweekly}>Quinzenal</option>
                    <option value={RecurringFrequencyEnum.Monthly}>Mensal</option>
                  </select>
                </div>
                <Input
                  type="date"
                  value={newStartDate}
                  onChange={(event) => setNewStartDate(event.target.value)}
                />
              </div>
              <DialogFooter>
                <Button size="sm" onClick={handleCreate}>Criar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeaderAction>
      </PageHeader>

      {hasTemplates ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => {
            const frequencyLabel = frequencyToLabel(template.frequency)
            const formattedDate = formatDate(template.nextDue)
            const isInactive = !template.isActive
            const cardClass = cn("border rounded-lg p-4", isInactive && "opacity-60")
            const toggleVariant = template.isActive ? "destructive" : "secondary"
            const toggleLabel = template.isActive ? "Desativar" : "Ativar"
            return (
              <div key={template.id} className={cardClass}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0 mr-2">
                    <h3 className="font-semibold">{template.title}</h3>
                    {template.description && (
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    )}
                  </div>
                  <StatusBadge variant="brand">{frequencyLabel}</StatusBadge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">📅 Próxima: {formattedDate}</p>
                <p className="text-sm text-muted-foreground mb-4">👤 {template.assignedToName}</p>
                <Button
                  variant={toggleVariant}
                  size="sm"
                  className="w-full"
                  onClick={() => handleToggle(template.id, template.isActive)}
                >
                  {toggleLabel}
                </Button>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState>
          <EmptyStateIcon>🔁</EmptyStateIcon>
          <EmptyStateTitle>Nenhuma recorrência encontrada</EmptyStateTitle>
          <EmptyStateDescription>Crie sua primeira tarefa recorrente.</EmptyStateDescription>
        </EmptyState>
      )}
    </>
  )
}
