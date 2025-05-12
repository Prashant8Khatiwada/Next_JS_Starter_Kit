export interface Task {
  id: string
  title: string
  priority: "low" | "medium" | "high"
  completed: boolean
}

export type NewTask = Omit<Task, "id">
