import { useEffect } from "react"
import { useLoaderData } from "react-router"
import type { LoaderFunctionArgs } from "react-router"
import type { Task } from "@homework/types/task.interface"
import { TaskStatus } from "@homework/types/task.enum"
import { listTasks } from "~/lib/services/tasks.service.server"
import { tasksStore } from "~/lib/stores/tasks.store"
import { useTasks } from "~/lib/hooks/use-tasks"
import { PageHeader, PageHeaderContent, PageHeaderTitle } from "~/components/ui/page-header"

export async function loader({ request }: LoaderFunctionArgs) {
  const tasks = await listTasks(request)
  return { tasks }
}

export default function Relatorios() {
  const { tasks: loaderTasks } = useLoaderData<typeof loader>()
  const tasks = useTasks()

  useEffect(() => {
    tasksStore.setAll(loaderTasks)
  }, [loaderTasks])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === TaskStatus.Done).length
  const pendingTasks = tasks.filter((task) => task.status === TaskStatus.Pending).length
  const overdueTasks = tasks.filter((task) => task.status === TaskStatus.Overdue).length
  const completionRate =
    totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : "0"

  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Relatórios</PageHeaderTitle>
        </PageHeaderContent>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-lg p-6 bg-card">
          <p className="text-sm text-muted-foreground mb-2">Total de Tarefas</p>
          <p className="text-3xl font-bold text-card-foreground">{totalTasks}</p>
        </div>

        <div className="border rounded-lg p-6 bg-card">
          <p className="text-sm text-muted-foreground mb-2">Concluídas</p>
          <p className="text-3xl font-bold text-status-done">{completedTasks}</p>
        </div>

        <div className="border rounded-lg p-6 bg-card">
          <p className="text-sm text-muted-foreground mb-2">Pendentes</p>
          <p className="text-3xl font-bold text-status-pending">{pendingTasks}</p>
        </div>

        <div className="border rounded-lg p-6 bg-card">
          <p className="text-sm text-muted-foreground mb-2">Em Atraso</p>
          <p className="text-3xl font-bold text-status-overdue">{overdueTasks}</p>
        </div>

        <div className="border rounded-lg p-6 bg-card md:col-span-2 lg:col-span-4">
          <p className="text-sm text-muted-foreground mb-2">Taxa de Conclusão</p>
          <p className="text-4xl font-bold text-primary">{completionRate}%</p>
        </div>
      </div>
    </>
  )
}
