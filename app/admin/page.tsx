"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Title, Paper, Text, Grid, Table, Badge, Group, Avatar, ActionIcon, Button } from "@mantine/core"
import { Edit, Plus, Trash } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/layout"

// Mock user data
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "user",
    status: "inactive",
    avatar: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "user",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=4",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "user",
    status: "inactive",
    avatar: "https://i.pravatar.cc/150?u=5",
  },
]

export default function AdminPage() {
  return (
    <AuthGuard requiredRole="admin">
      <DashboardLayout>
        <Title order={2} mb="lg">
          Admin Dashboard
        </Title>

        <Paper withBorder p="md" radius="md" mb="xl">
          <Text>
            Welcome to the admin dashboard. Here you can manage users, view system statistics, and configure application
            settings.
          </Text>
        </Paper>

        <Grid>
          <Grid.Col span={12}>
            <Paper shadow="xs" p="md" withBorder>
              <Group position="apart" mb="md">
                <Title order={3}>User Management</Title>
                <Button leftSection={<Plus size={16} />}>Add User</Button>
              </Group>

              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>User</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {users.map((user) => (
                    <Table.Tr key={user.id}>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar src={user.avatar} size={30} radius="xl" />
                          <Text size="sm" fw={500}>
                            {user.name}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>{user.email}</Table.Td>
                      <Table.Td>
                        <Badge color={user.role === "admin" ? "purple" : "blue"}>{user.role}</Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={user.status === "active" ? "green" : "red"}>{user.status}</Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <ActionIcon variant="subtle" onClick={() => alert(`Edit user: ${user.name}`)}>
                            <Edit size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="red" onClick={() => alert(`Delete user: ${user.name}`)}>
                            <Trash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </Grid.Col>
        </Grid>
      </DashboardLayout>
    </AuthGuard>
  )
}
