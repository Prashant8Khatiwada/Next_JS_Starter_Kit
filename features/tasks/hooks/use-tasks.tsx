"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Task, NewTask } from "../types"
import { getTasks, createTask, updateTask, deleteTask as apiDeleteTask } from "../api/tasks-service"

export function useTasks() {
  const queryClient = useQueryClient()

  // Fetch tasks
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  })

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: (newTask: NewTask) => createTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: (task: Task) => updateTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => apiDeleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  return {
    tasks,
    isLoading: isLoading || addTaskMutation.isPending || updateTaskMutation.isPending || deleteTaskMutation.isPending,
    error,
    addTask: addTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
  }
}
