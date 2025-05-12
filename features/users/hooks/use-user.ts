"use client"

import { useQuery } from "@tanstack/react-query"

interface User {
  id: string
  name: string
  email: string
  avatar: string
}

// Mock API function - replace with actual API call
async function fetchUser(userId: string): Promise<User> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock data
  return {
    id: userId,
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://i.pravatar.cc/150?u=" + userId,
  }
}

export function useUser(userId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  })

  return {
    user: data,
    isLoading,
    error,
  }
}
