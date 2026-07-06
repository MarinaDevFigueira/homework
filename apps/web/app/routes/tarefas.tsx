import { useEffect, useMemo, useState } from "react"
import { useLoaderData } from "react-router"
import type { LoaderFunctionArgs } from "react-router"
import type { Task } from "@homework/types/task.interface"
import type { Resource } from "@homework/types/resource.interface"
import { TaskStatus } from "@homework/types/task.enum"
import { UserRole } from "@homework/types/user.enum"
import { listTasks } from "~/lib/services/tasks.service.server"
import { tasksService } from "~/lib/services/tasks.service"
import { resourcesService } from "~/lib/services/resources.service"
import { tasksStore } from "~/lib/stores/tasks.store"
import { authStore } from "~/lib/stores/auth.store"
import { useTasks } from "~/lib/hooks/use-tasks"
import type { ResourceReporterState, InstanceDraft } from "~/routes/tarefas.types"
import { PageHeader, PageHeaderContent, PageHeaderTitle, PageHeaderSubtitle, PageHeaderAction } from "~/components/ui/page-header"
import { FilterChips, FilterChip } from "~/components/ui/filter-chips"
import { TaskCard, TaskCardHeader, TaskCardUser, TaskCardUserInfo, TaskCardUserName, TaskCardUserDate, TaskCardTitle, TaskCardDescription, TaskCardMeta, TaskCardActions } from "~/components/ui/task-card"
import { StatusBadge } from "~/components/ui/status-badge"
import { Avatar } from "~/components/ui/avatar"
import { MetaChip, MetaChipIcon } from "~/components/ui/meta-chip"
import { EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription } from "~/components/ui/empty-state"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "~/components/ui/drawer"
import {
  ResourceCardInstances,
  ResourceCardInstanceRow,
  ResourceCardInstanceLabel,
  CapacityBar,
} from "~/components/ui/resource-card"

export async function loader({ request }: LoaderFunctionArgs) {
  const tasks = await listTasks(request)
  return { tasks }
}

const FILTERS = ["Todas", "Pendentes", "Em progresso", "Pausadas", "Concluídas", "Atrasadas", "Canceladas"] as const
const CAPACITY_OPTIONS = [0, 10, 25, 50, 75, 100] as const

const STATUS_FILTER_MAP: Record<(typeof FILTERS)[number], TaskStatus | null> = {
  "Todas": null,
  "Pendentes": TaskStatus.Pending,
  "Em progresso": TaskStatus.InProgress,
  "Pausadas": TaskStatus.Paused,
  "Concluídas": TaskStatus.Done,
  "Atrasadas": TaskStatus.Overdue,
  "Canceladas": TaskStatus.Cancelled,
}

const TASK_STATUS_TO_BADGE: Record<TaskStatus, "pending" | "progress" | "done" | "overdue"> = {
  [TaskStatus.Pending]: "pending",
  [TaskStatus.InProgress]: "progress",
  [TaskStatus.Paused]: "pending",
  [TaskStatus.Done]: "done",
  [TaskStatus.Overdue]: "overdue",
  [TaskStatus.Cancelled]: "overdue",
}

const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  [TaskStatus.Pending]: "Pendente",
  [TaskStatus.InProgress]: "Em progresso",
  [TaskStatus.Paused]: "Pausada",
  [TaskStatus.Done]: "Concluída",
  [TaskStatus.Overdue]: "Atrasada",
  [TaskStatus.Cancelled]: "Cancelada",
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const firstInitial = parts[0]?.[0] ?? ""
  const lastInitial = parts[parts.length - 1]?.[0] ?? ""
  const isDifferentParts = parts.length > 1
  const initials = isDifferentParts ? firstInitial + lastInitial : firstInitial
  return initials.toUpperCase()
}

function formatDueDate(isoString: string | null): string {
  const isNullDate = !isoString
  if (isNullDate) return "Sem prazo"
  const date = new Date(isoString)
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

export default function Tarefas() {
  const { tasks: loaderTasks } = useLoaderData<typeof loader>()
  useMemo(() => { tasksStore.setAll(loaderTasks) }, [loaderTasks])
  const tasks = useTasks()
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("Todas")
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [reporter, setReporter] = useState<ResourceReporterState | null>(null)
  const [availableResources, setAvailableResources] = useState<Resource[]>([])
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([])
  const [isLoadingResources, setIsLoadingResources] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)

  useEffect(() => {
    const isDialogOpen = isCreating
    if (!isDialogOpen) return
    const loadResources = async () => {
      setIsLoadingResources(true)
      const resources = await resourcesService.list()
      setAvailableResources(resources)
      setIsLoadingResources(false)
    }
    loadResources()
  }, [isCreating])

  const currentUser = authStore.state
  const isAdmin = currentUser?.role === UserRole.Admin

  const filterStatus = STATUS_FILTER_MAP[activeFilter]
  const visibleTasks = filterStatus
    ? tasks.filter((task) => task.status === filterStatus)
    : tasks

  const hasVisibleTasks = visibleTasks.length > 0
  const isDrawerOpen = reporter !== null

  async function handleFinishClick(task: Task) {
    const loadingState: ResourceReporterState = { task, drafts: [], isLoading: true }
    setReporter(loadingState)

    const hasLinkedResources = task.resourceIds.length > 0
    if (!hasLinkedResources) {
      const loadedState: ResourceReporterState = { task, drafts: [], isLoading: false }
      setReporter(loadedState)
      return
    }

    const allResources = await resourcesService.list()
    const linkedResources = allResources.filter((resource) =>
      task.resourceIds.includes(resource.id),
    )
    const drafts: InstanceDraft[] = linkedResources.flatMap((resource) =>
      resource.instances.map((instance, index) => {
        const draft: InstanceDraft = {
          instanceId: instance.id,
          resourceId: resource.id,
          resourceName: resource.name,
          instanceIndex: index,
          capacityBefore: instance.capacity,
          capacity: instance.capacity,
        }
        return draft
      }),
    )

    const loadedState: ResourceReporterState = { task, drafts, isLoading: false }
    setReporter(loadedState)
  }

  function handleDraftChange(instanceId: string, capacity: number) {
    const hasReporter = !!reporter
    if (!hasReporter) return
    const updatedDrafts = reporter.drafts.map((draft) => {
      const isMatch = draft.instanceId === instanceId
      if (!isMatch) return draft
      const updatedDraft = { ...draft, capacity }
      return updatedDraft
    })
    const updatedReporter = { ...reporter, drafts: updatedDrafts }
    setReporter(updatedReporter)
  }

  async function handleConfirmFinish() {
    const hasReporter = !!reporter
    if (!hasReporter) return

    setIsFinishing(true)
    try {
      const snapshots = reporter.drafts.map((draft) => ({
        instanceId: draft.instanceId,
        resourceId: draft.resourceId,
        capacityBefore: draft.capacityBefore,
        capacityAfter: draft.capacity,
      }))

      const updated = await tasksService.finish(reporter.task.id, snapshots)
      const isSuccess = !!updated
      if (isSuccess) {
        tasksStore.update(updated)
      }
      setReporter(null)
    } catch {
      alert("Erro ao concluir tarefa. Tente novamente.")
    } finally {
      setIsFinishing(false)
    }
  }

  async function handleStart(task: Task) {
    const updated = await tasksService.start(task.id)
    const isSuccess = !!updated
    if (isSuccess) tasksStore.update(updated)
  }

  async function handlePause(task: Task) {
    const updated = await tasksService.pause(task.id)
    const isSuccess = !!updated
    if (isSuccess) tasksStore.update(updated)
  }

  async function handleResume(task: Task) {
    const updated = await tasksService.resume(task.id)
    const isSuccess = !!updated
    if (isSuccess) tasksStore.update(updated)
  }

  async function handleCancel(task: Task) {
    const updated = await tasksService.cancel(task.id)
    const isSuccess = !!updated
    if (isSuccess) tasksStore.update(updated)
  }

  async function handleCreate() {
    const isTitleEmpty = newTitle.trim() === ""
    if (isTitleEmpty) return

    const hasCurrentUser = !!currentUser
    if (!hasCurrentUser) return

    const hasSelectedResources = selectedResourceIds.length > 0
    const created = await tasksService.create({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      assignedToId: currentUser.id,
      resourceIds: hasSelectedResources ? selectedResourceIds : undefined,
    })

    const isSuccess = !!created
    if (isSuccess) {
      tasksStore.add(created)
      setNewTitle("")
      setNewDescription("")
      setSelectedResourceIds([])
      setIsCreating(false)
    }
  }

  function handleDialogOpenChange(open: boolean) {
    setIsCreating(open)
    const shouldClearResources = !open
    if (shouldClearResources) {
      setSelectedResourceIds([])
    }
  }

  function handleDrawerOpenChange(open: boolean) {
    const shouldClearReporter = !open
    if (shouldClearReporter) {
      setReporter(null)
    }
  }

  const resourcesByName = reporter
    ? Array.from(
        reporter.drafts.reduce((accumulator, draft) => {
          const existing = accumulator.get(draft.resourceName) ?? []
          accumulator.set(draft.resourceName, [...existing, draft])
          return accumulator
        }, new Map<string, InstanceDraft[]>()),
      )
    : []

  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Minhas Tarefas</PageHeaderTitle>
          <PageHeaderSubtitle>{tasks.length} tarefas no total</PageHeaderSubtitle>
        </PageHeaderContent>
        {isAdmin && (
          <PageHeaderAction>
            <Dialog open={isCreating} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger render={<Button size="sm" />}>+ Nova</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Tarefa</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                  <Input
                    placeholder="Título da tarefa"
                    value={newTitle}
                    onChange={(event) => setNewTitle(event.target.value)}
                  />
                  <Input
                    placeholder="Descrição (opcional)"
                    value={newDescription}
                    onChange={(event) => setNewDescription(event.target.value)}
                  />
                  <div className="border-t pt-3">
                    <p className="text-xs font-semibold mb-2">Recursos (opcional)</p>
                    {isLoadingResources && (
                      <p className="text-xs text-muted-foreground">Buscando recursos...</p>
                    )}
                    {!isLoadingResources && availableResources.length === 0 && (
                      <p className="text-xs text-muted-foreground">Nenhum recurso cadastrado</p>
                    )}
                    {!isLoadingResources && availableResources.length > 0 && (
                      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                        {availableResources.map((resource) => {
                          const isSelected = selectedResourceIds.includes(resource.id)
                          return (
                            <label key={resource.id} className="flex items-center gap-2 text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(event) => {
                                  const isChecked = event.target.checked
                                  const updatedIds = isChecked
                                    ? [...selectedResourceIds, resource.id]
                                    : selectedResourceIds.filter((resourceId) => resourceId !== resource.id)
                                  setSelectedResourceIds(updatedIds)
                                }}
                                className="rounded"
                              />
                              {resource.name}
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button size="sm" onClick={handleCreate}>Criar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeaderAction>
        )}
      </PageHeader>

      <FilterChips className="mb-4">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter
          return (
            <FilterChip
              key={filter}
              active={isActive}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </FilterChip>
          )
        })}
      </FilterChips>

      {hasVisibleTasks ? (
        <div className="flex flex-col gap-2.5">
          {visibleTasks.map((task) => {
            const badgeVariant = TASK_STATUS_TO_BADGE[task.status]
            const initials = getInitials(task.assignedToName)
            const formattedDate = formatDueDate(task.dueDate)
            const isAssignee = currentUser?.id === task.assignedToId
            const canActOnTask = isAdmin || isAssignee
            const isPending = task.status === TaskStatus.Pending
            const isInProgress = task.status === TaskStatus.InProgress
            const isPaused = task.status === TaskStatus.Paused
            const isDone = task.status === TaskStatus.Done
            const isCancelled = task.status === TaskStatus.Cancelled
            const isTerminal = isDone || isCancelled
            return (
              <TaskCard key={task.id}>
                <TaskCardHeader>
                  <TaskCardUser>
                    <Avatar initials={initials} size="sm" />
                    <TaskCardUserInfo>
                      <TaskCardUserName>{task.assignedToName}</TaskCardUserName>
                      <TaskCardUserDate>{formattedDate}</TaskCardUserDate>
                    </TaskCardUserInfo>
                  </TaskCardUser>
                  <StatusBadge variant={badgeVariant}>{TASK_STATUS_LABEL[task.status]}</StatusBadge>
                </TaskCardHeader>

                <TaskCardTitle>{task.title}</TaskCardTitle>

                {task.description && (
                  <TaskCardDescription>{task.description}</TaskCardDescription>
                )}

                <TaskCardMeta>
                  <MetaChip>
                    <MetaChipIcon>📅</MetaChipIcon>
                    {formattedDate}
                  </MetaChip>
                </TaskCardMeta>

                <TaskCardActions>
                  {canActOnTask && isPending && (
                    <Button variant="outline" size="sm" onClick={() => handleStart(task)}>
                      Iniciar
                    </Button>
                  )}
                  {canActOnTask && isInProgress && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handlePause(task)}>
                        Pausar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleFinishClick(task)}>
                        Finalizar
                      </Button>
                    </>
                  )}
                  {canActOnTask && isPaused && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleResume(task)}>
                        Retomar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleFinishClick(task)}>
                        Finalizar
                      </Button>
                    </>
                  )}
                  {isAdmin && !isTerminal && (
                    <Button variant="ghost" size="sm" onClick={() => handleCancel(task)}>
                      Cancelar
                    </Button>
                  )}
                </TaskCardActions>
              </TaskCard>
            )
          })}
        </div>
      ) : (
        <EmptyState>
          <EmptyStateIcon>✅</EmptyStateIcon>
          <EmptyStateTitle>Nenhuma tarefa encontrada</EmptyStateTitle>
          <EmptyStateDescription>
            Não há tarefas com esse filtro no momento.
          </EmptyStateDescription>
        </EmptyState>
      )}

      <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange}>
        <DrawerContent>
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle>Recursos Utilizados</DrawerTitle>
            <DrawerClose render={<Button variant="ghost" size="sm" />}>✕</DrawerClose>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {reporter?.isLoading && (
              <p className="text-sm text-muted-foreground text-center py-4">Buscando dados</p>
            )}

            {!reporter?.isLoading && resourcesByName.map(([resourceName, drafts]) => (
              <div key={resourceName}>
                <p className="text-sm font-semibold mb-2">{resourceName}</p>
                <ResourceCardInstances>
                  {drafts.map((draft) => {
                    const isLow = draft.capacity < 30
                    const isWarn = draft.capacity >= 30 && draft.capacity < 70
                    return (
                      <ResourceCardInstanceRow key={draft.instanceId}>
                        <ResourceCardInstanceLabel>Un.{draft.instanceIndex + 1}</ResourceCardInstanceLabel>
                        <CapacityBar percent={draft.capacity} low={isLow} warn={isWarn} />
                        <select
                          value={draft.capacity}
                          onChange={(event) => handleDraftChange(draft.instanceId, Number(event.target.value))}
                          className="w-16 shrink-0 rounded border px-1 py-0.5 text-xs bg-background"
                        >
                          {CAPACITY_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}%</option>
                          ))}
                        </select>
                      </ResourceCardInstanceRow>
                    )
                  })}
                </ResourceCardInstances>
              </div>
            ))}

            {!reporter?.isLoading && resourcesByName.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum recurso vinculado a esta tarefa
              </p>
            )}
          </div>

          <DrawerFooter>
            <Button onClick={handleConfirmFinish} disabled={isFinishing} className="w-full">
              {isFinishing ? "Finalizando..." : "Confirmar conclusão"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
