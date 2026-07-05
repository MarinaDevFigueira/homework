import { PageHeader, PageHeaderContent, PageHeaderTitle, PageHeaderSubtitle, PageHeaderAction } from "~/components/ui/page-header"
import { FilterChips, FilterChip } from "~/components/ui/filter-chips"
import { TaskCard, TaskCardHeader, TaskCardUser, TaskCardUserInfo, TaskCardUserName, TaskCardUserDate, TaskCardTitle, TaskCardDescription, TaskCardMeta, TaskCardActions } from "~/components/ui/task-card"
import { StatusBadge } from "~/components/ui/status-badge"
import { Avatar } from "~/components/ui/avatar"
import { MetaChip, MetaChipIcon } from "~/components/ui/meta-chip"
import { EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription } from "~/components/ui/empty-state"
import { Button } from "~/components/ui/button"
import { useState } from "react"

const FILTERS = ["Todas", "Pendentes", "Em progresso", "Concluídas", "Atrasadas"] as const
type Filter = (typeof FILTERS)[number]

const SAMPLE_TASKS = [
  {
    id: "1",
    title: "Limpar a cozinha",
    description: "Lavar louça, limpar fogão e organizar bancada.",
    status: "pending" as const,
    assignee: { name: "Ana Lima", initials: "AL", role: "resident" as const },
    dueDate: "Hoje, 18h",
    location: "Cozinha",
  },
  {
    id: "2",
    title: "Passar aspirador na sala",
    description: "Aspirar tapetes e sofás.",
    status: "progress" as const,
    assignee: { name: "Carlos M.", initials: "CM", role: "admin" as const },
    dueDate: "Amanhã",
    location: "Sala",
  },
  {
    id: "3",
    title: "Trocar lâmpada do banheiro",
    description: null,
    status: "overdue" as const,
    assignee: { name: "Beatriz S.", initials: "BS", role: "resident" as const },
    dueDate: "Ontem",
    location: "Banheiro",
  },
]

const statusFilterMap: Record<Filter, string | null> = {
  "Todas":        null,
  "Pendentes":    "pending",
  "Em progresso": "progress",
  "Concluídas":   "done",
  "Atrasadas":    "overdue",
}

export default function Tarefas() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Todas")

  const filterValue = statusFilterMap[activeFilter]
  const visibleTasks = filterValue
    ? SAMPLE_TASKS.filter((task) => task.status === filterValue)
    : SAMPLE_TASKS

  const hasVisibleTasks = visibleTasks.length > 0

  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Minhas Tarefas</PageHeaderTitle>
          <PageHeaderSubtitle>{SAMPLE_TASKS.length} tarefas no total</PageHeaderSubtitle>
        </PageHeaderContent>
        <PageHeaderAction>
          <Button size="sm">+ Nova</Button>
        </PageHeaderAction>
      </PageHeader>

      <FilterChips className="mb-4">
        {FILTERS.map((filter) => (
          <FilterChip
            key={filter}
            active={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </FilterChip>
        ))}
      </FilterChips>

      {hasVisibleTasks ? (
        <div className="flex flex-col gap-2.5">
          {visibleTasks.map((task) => (
            <TaskCard key={task.id}>
              <TaskCardHeader>
                <TaskCardUser>
                  <Avatar
                    initials={task.assignee.initials}
                    userRole={task.assignee.role}
                    size="sm"
                  />
                  <TaskCardUserInfo>
                    <TaskCardUserName>{task.assignee.name}</TaskCardUserName>
                    <TaskCardUserDate>{task.dueDate}</TaskCardUserDate>
                  </TaskCardUserInfo>
                </TaskCardUser>
                <StatusBadge variant={task.status} />
              </TaskCardHeader>

              <TaskCardTitle>{task.title}</TaskCardTitle>

              {task.description && (
                <TaskCardDescription>{task.description}</TaskCardDescription>
              )}

              <TaskCardMeta>
                <MetaChip>
                  <MetaChipIcon>📍</MetaChipIcon>
                  {task.location}
                </MetaChip>
                <MetaChip>
                  <MetaChipIcon>📅</MetaChipIcon>
                  {task.dueDate}
                </MetaChip>
              </TaskCardMeta>

              <TaskCardActions>
                <Button variant="ghost" size="sm">Detalhes</Button>
                <Button variant="outline" size="sm">Concluir</Button>
              </TaskCardActions>
            </TaskCard>
          ))}
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
    </>
  )
}
