import type { Task, NewTask } from "../types"

// Mock data
let tasks: Task[] = [
  {
    id: "1",
    title: "Complete project documentation",
    priority: "high",
    completed: false,
  },
  {
    id: "2",
    title: "Review pull requests",
    priority: "medium",
    completed: true,
  },
  {
    id: "3",
    title: "Plan next sprint",
    priority: "medium",
    completed: false,
  },
  {
    id: "4",
    title: "Update dependencies",
    priority: "low",
    completed: false,
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Get all tasks
export async function getTasks(): Promise<Task[]> {
  await delay(500) // Simulate network delay
  return [...tasks]
}

// Get task by ID
export async function getTaskById(id: string): Promise<Task | undefined> {
  await delay(300)
  return tasks.find((task) => task.id === id)
}

// Create a new task
export async function createTask(newTask: NewTask): Promise<Task> {
  await delay(500)
  const task: Task = {
    ...newTask,
    id: Math.random().toString(36).substring(2, 9), // Generate random ID
  }
  tasks = [...tasks, task]
  return task
}

// Update an existing task
export async function updateTask(updatedTask: Task): Promise<Task> {
  await delay(500)
  tasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
  return updatedTask
}

// Delete a task
export async function deleteTask(id: string): Promise<void> {
  await delay(500)
  tasks = tasks.filter((task) => task.id !== id)
}
