"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface UsersContextType {
  selectedUserId: string | null
  selectUser: (userId: string) => void
  clearSelectedUser: () => void
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const selectUser = useCallback((userId: string) => {
    setSelectedUserId(userId)
  }, [])

  const clearSelectedUser = useCallback(() => {
    setSelectedUserId(null)
  }, [])

  return (
    <UsersContext.Provider value={{ selectedUserId, selectUser, clearSelectedUser }}>{children}</UsersContext.Provider>
  )
}

export function useUsersContext() {
  const context = useContext(UsersContext)
  if (context === undefined) {
    throw new Error("useUsersContext must be used within a UsersProvider")
  }
  return context
}
