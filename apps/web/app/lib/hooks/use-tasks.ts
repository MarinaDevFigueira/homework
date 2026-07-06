import { useEffect, useState } from "react"
import type { Task } from "@homework/types/task.interface"
import { tasksStore } from "~/lib/stores/tasks.store"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(tasksStore.state)

  useEffect(() => {
    const subscription = tasksStore.subject.subscribe((nextTasks) => {
      setTasks(nextTasks)
    })
    return () => subscription.unsubscribe()
  }, [])

  return tasks
}
