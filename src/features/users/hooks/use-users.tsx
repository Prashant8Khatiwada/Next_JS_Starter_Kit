"use client"

import { useState, useCallback } from "react"
import type { User, NewUser } from "../types"
import { getUsers, createUser, updateUser as apiUpdateUser, deleteUser as apiDeleteUser } from "../api/users-service"

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Fetch users with filters and pagination
  const fetchUsers = useCallback(async (filters: Record<string, any> = {}, page = 1, limit = 10) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getUsers(filters, page, limit)
      setUsers(result.users)
      setTotal(result.total)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch users"))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Add user
  const addUser = useCallback(async (newUser: NewUser) => {
    setIsLoading(true)
    setError(null)

    try {
      const user = await createUser(newUser)
      setUsers((prev) => [...prev, user])
      setTotal((prev) => prev + 1)
      return user
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to add user"))
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update user
  const updateUser = useCallback(async (user: User) => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedUser = await apiUpdateUser(user)
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)))
      return updatedUser
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update user"))
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Delete user
  const deleteUser = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await apiDeleteUser(id)
      setUsers((prev) => prev.filter((user) => user.id !== id))
      setTotal((prev) => prev - 1)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete user"))
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    users,
    total,
    isLoading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
  }
}
