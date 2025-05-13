"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/src/components/dashboard/layout";
import {
  Group,
  Text,
  Avatar,
  TextInput,
  Button,
  Paper,
  Title,
  Loader,
  Table,
  ActionIcon,
  Menu,
  Box,
  Pagination,
} from "@mantine/core";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash,
  Eye,
  MoreHorizontal,
  MapPin,
  AtSign,
  Phone,
} from "lucide-react";

// User type from JSONPlaceholder API
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

// Filter type
interface UserFilters {
  search: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);

  // Fetch users from JSONPlaceholder API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch users")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...users];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.username.toLowerCase().includes(searchLower) ||
          user.company.name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredUsers(result);
    setPage(1); // Reset to first page when filters change
  }, [filters, users]);

  // Handle pagination
  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setDisplayedUsers(filteredUsers.slice(start, end));
  }, [filteredUsers, page, pageSize]);

  // Update filters
  const updateFilter = (key: keyof UserFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[calc(100vh-120px)]">
          <Loader size="xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Paper p="xl" withBorder>
          <Text c="red" ta="center">
            Error: {error.message}
          </Text>
          <Button mt="md" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Paper>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box className="flex justify-between items-center mb-6">
        <Title order={2}>Users</Title>
        <Button leftSection={<Plus size={16} />}>Add User</Button>
      </Box>

      <Paper withBorder p="md" radius="md" mb="lg">
        <Group position="apart" mb="md">
          <Text fw={500}>Filters</Text>
          <Button
            variant="subtle"
            leftSection={<Filter size={16} />}
            onClick={resetFilters}
          >
            Reset
          </Button>
        </Group>

        <TextInput
          label="Search"
          placeholder="Search users..."
          leftSection={<Search size={16} />}
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
      </Paper>

      <Paper withBorder radius="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Company</Table.Th>
              <Table.Th style={{ width: 100 }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {displayedUsers.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text ta="center" py="lg">
                    No users found
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              displayedUsers.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar color="blue" radius="xl">
                        {user.name.charAt(0)}
                      </Avatar>
                      <div>
                        <Text fw={500} size="sm">
                          {user.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          @{user.username}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <div>
                      <Group gap="xs">
                        <AtSign size={14} />
                        <Text size="sm">{user.email}</Text>
                      </Group>
                      <Group gap="xs" mt={4}>
                        <Phone size={14} />
                        <Text size="sm">{user.phone}</Text>
                      </Group>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <MapPin size={14} />
                      <Text size="sm">
                        {user.address.city}, {user.address.zipcode}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <div>
                      <Text size="sm" fw={500}>
                        {user.company.name}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {user.company.catchPhrase}
                      </Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => alert(`View user: ${user.name}`)}
                      >
                        <Eye size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        onClick={() => alert(`Edit user: ${user.name}`)}
                      >
                        <Edit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => alert(`Delete user: ${user.name}`)}
                      >
                        <Trash size={16} />
                      </ActionIcon>
                      <Menu position="bottom-end" withinPortal>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <MoreHorizontal size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            onClick={() =>
                              alert(`Send email to: ${user.email}`)
                            }
                          >
                            Send Email
                          </Menu.Item>
                          <Menu.Item
                            onClick={() =>
                              alert(`Reset password for: ${user.name}`)
                            }
                          >
                            Reset Password
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      <Group position="apart" mt="lg">
        <Text size="sm">
          Showing {displayedUsers.length} of {filteredUsers.length} users
        </Text>
        <Pagination
          total={Math.ceil(filteredUsers.length / pageSize)}
          value={page}
          onChange={setPage}
          withEdges
        />
      </Group>
    </DashboardLayout>
  );
}
