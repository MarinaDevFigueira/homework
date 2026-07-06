import { useMemo, useState } from "react"
import { useLoaderData } from "react-router"
import type { LoaderFunctionArgs } from "react-router"
import type { Task } from "@homework/types/task.interface"
import { TaskStatus } from "@homework/types/task.enum"
import type { AgendaFilterType } from "~/routes/agenda.types"
import { listTasks } from "~/lib/services/tasks.service.server"
import { tasksStore } from "~/lib/stores/tasks.store"
import { useTasks } from "~/lib/hooks/use-tasks"
import { PageHeader, PageHeaderContent, PageHeaderTitle } from "~/components/ui/page-header"
import { FilterChips, FilterChip } from "~/components/ui/filter-chips"
import { EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription } from "~/components/ui/empty-state"
import { StatusBadge } from "~/components/ui/status-badge"
import { Avatar } from "~/components/ui/avatar"

export async function loader({ request }: LoaderFunctionArgs) {
  const tasks = await listTasks(request)
  return { tasks }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const firstInitial = parts[0]?.[0] ?? ""
  const lastInitial = parts[parts.length - 1]?.[0] ?? ""
  const isDifferentParts = parts.length > 1
  const initials = isDifferentParts ? firstInitial + lastInitial : firstInitial
  return initials.toUpperCase()
}

function groupTasksByDate(tasks: Task[]): Map<string, Task[]> {
  const grouped = new Map<string, Task[]>()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const sevenDaysFromNow = new Date(today)
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

  tasks.forEach((task) => {
    let key = "Sem prazo"
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      key = dueDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })
    }

    const hasKey = grouped.has(key)
    if (!hasKey) {
      grouped.set(key, [])
    }
    grouped.get(key)!.push(task)
  })

  return grouped
}

function filterTasksByRange(tasks: Task[], filterType: AgendaFilterType): Task[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isThisWeek = filterType === "Esta semana"
  if (isThisWeek) {
    const sevenDaysFromNow = new Date(today)
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    return tasks.filter((task) => {
      const hasNullDate = !task.dueDate
      if (hasNullDate) return false
      const dueDate = new Date(task.dueDate as string)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate >= today && dueDate <= sevenDaysFromNow
    })
  }

  const isThisMonth = filterType === "Este mês"
  if (isThisMonth) {
    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    return tasks.filter((task) => {
      const hasNullDate = !task.dueDate
      if (hasNullDate) return false
      const dueDate = new Date(task.dueDate as string)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate >= today && dueDate < nextMonth
    })
  }

  return tasks
}

const TASK_STATUS_TO_BADGE: Record<TaskStatus, "pending" | "progress" | "done" | "overdue"> = {
  [TaskStatus.Pending]: "pending",
  [TaskStatus.InProgress]: "progress",
  [TaskStatus.Done]: "done",
  [TaskStatus.Overdue]: "overdue",
}

const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  [TaskStatus.Pending]: "Pendente",
  [TaskStatus.InProgress]: "Em progresso",
  [TaskStatus.Done]: "Concluída",
  [TaskStatus.Overdue]: "Atrasada",
}

const FILTERS: AgendaFilterType[] = ["Esta semana", "Este mês", "Tudo"]

export default function Agenda() {
  const { tasks: loaderTasks } = useLoaderData<typeof loader>()
  useMemo(() => { tasksStore.setAll(loaderTasks) }, [loaderTasks])
  const tasks = useTasks()
  const [activeFilter, setActiveFilter] = useState<AgendaFilterType>("Tudo")

  const filteredTasks = filterTasksByRange(tasks, activeFilter)
  const groupedTasks = groupTasksByDate(filteredTasks)
  const hasTasks = filteredTasks.length > 0

  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Agenda</PageHeaderTitle>
        </PageHeaderContent>
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

      {hasTasks ? (
        <div className="flex flex-col gap-6">
          {Array.from(groupedTasks.entries()).map(([dateKey, tasksForDate]) => (
            <div key={dateKey}>
              <h3 className="font-semibold text-lg mb-3 text-foreground">{dateKey}</h3>
              <div className="flex flex-col gap-2">
                {tasksForDate.map((task) => {
                  const badgeVariant = TASK_STATUS_TO_BADGE[task.status]
                  const initials = getInitials(task.assignedToName)
                  return (
                    <div key={task.id} className="border rounded-lg p-4 flex items-start gap-3">
                      <Avatar initials={initials} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-semibold">{task.title}</h4>
                          <StatusBadge variant={badgeVariant}>{TASK_STATUS_LABEL[task.status]}</StatusBadge>
                        </div>
                        <p className="text-sm text-muted-foreground">{task.assignedToName}</p>
                        {task.description && (
                          <p className="text-sm text-foreground mt-2">{task.description}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState>
          <EmptyStateIcon>📅</EmptyStateIcon>
          <EmptyStateTitle>Nenhuma tarefa encontrada</EmptyStateTitle>
          <EmptyStateDescription>
            Não há tarefas com esse filtro no período selecionado.
          </EmptyStateDescription>
        </EmptyState>
      )}
    </>
  )
}
