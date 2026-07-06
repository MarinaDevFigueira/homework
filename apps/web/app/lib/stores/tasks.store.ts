import { BehaviorSubject } from "rxjs"
import type { Task } from "@homework/types/task.interface"

const tasksSubject = new BehaviorSubject<Task[]>([])

export const tasksStore = {
  subject: tasksSubject,
  get state() {
    return tasksSubject.getValue()
  },
  setAll(tasks: Task[]) {
    tasksSubject.next(tasks)
  },
  add(task: Task) {
    tasksSubject.next([...tasksSubject.getValue(), task])
  },
  update(updated: Task) {
    const currentTasks = tasksSubject.getValue()
    const nextTasks = currentTasks.map((task) => {
      const isMatch = task.id === updated.id
      return isMatch ? updated : task
    })
    tasksSubject.next(nextTasks)
  },
  remove(taskId: string) {
    const currentTasks = tasksSubject.getValue()
    const nextTasks = currentTasks.filter((task) => task.id !== taskId)
    tasksSubject.next(nextTasks)
  },
}
