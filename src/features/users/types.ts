export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  status: "active" | "inactive"
}

export type NewUser = Omit<User, "id">
