import { createApiService } from "@/lib/api-client"
import type { User, NewUser } from "../types"

// Create a typed API service for users
const usersApiService = createApiService<User>("/users")

// Mock data
let users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    status: "active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "user",
    status: "inactive",
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Get all users with filtering and pagination
export async function getUsers(
  filters: Record<string, any> = {},
  page = 1,
  limit = 10,
): Promise<{ users: User[]; total: number }> {
  await delay(500) // Simulate network delay

  // Apply filters
  let filteredUsers = [...users]

  if (filters.role) {
    filteredUsers = filteredUsers.filter((user) => user.role === filters.role)
  }

  if (filters.status) {
    filteredUsers = filteredUsers.filter((user) => user.status === filters.status)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredUsers = filteredUsers.filter(
      (user) => user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower),
    )
  }

  // Apply pagination
  const total = filteredUsers.length
  const start = (page - 1) * limit
  const paginatedUsers = filteredUsers.slice(start, start + limit)

  return { users: paginatedUsers, total }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | undefined> {
  await delay(300)
  return users.find((user) => user.id === id)
}

// Create a new user
export async function createUser(newUser: NewUser): Promise<User> {
  await delay(500)
  const user: User = {
    ...newUser,
    id: Math.random().toString(36).substring(2, 9), // Generate random ID
  }
  users = [...users, user]
  return user
}

// Update an existing user
export async function updateUser(updatedUser: User): Promise<User> {
  await delay(500)
  users = users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
  return updatedUser
}

// Delete a user
export async function deleteUser(id: string): Promise<void> {
  await delay(500)
  users = users.filter((user) => user.id !== id)
}

// In a real app, you would use the API client instead of these mock functions
export const usersApi = {
  ...usersApiService,
  // Add any custom methods here
  getUsersWithFilters: (filters: Record<string, any>, page: number, limit: number) => getUsers(filters, page, limit),
}
