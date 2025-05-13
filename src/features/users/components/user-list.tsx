"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Table,
  ActionIcon,
  Group,
  Text,
  Badge,
  Avatar,
  Loader,
  Button,
  Modal,
  TextInput,
  Select,
  Pagination,
  Paper,
  Title,
  Box,
  Divider,
  Input,
} from "@mantine/core";
import { useUsers } from "../hooks/use-users";
import type { User, NewUser } from "../types";
import { Pencil, Trash, Plus, Search, Filter } from "lucide-react";
import { useFilters } from "@/src/hooks/use-filters";
import { usePagination } from "@/src/hooks/use-pagination";

interface UserFilters {
  search: string;
  role: "user" | "admin" | "";
  status: "active" | "inactive" | "";
}

export function UserList() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<NewUser>({
    name: "",
    email: "",
    role: "user",
    status: "active",
  });

  // Filters
  const { filters, setFilter, resetFilters, getQueryParams } =
    useFilters<UserFilters>({
      initialFilters: {
        search: "",
        role: "",
        status: "",
      },
    });

  // Pagination
  const {
    page,
    pageSize,
    totalPages,
    goToPage,
    changePageSize,
    paginationParams,
  } = usePagination({
    initialPage: 1,
    initialPageSize: 5,
  });

  // Users data with filtering and pagination
  const {
    users,
    total,
    isLoading,
    addUser,
    updateUser,
    deleteUser,
    error,
    fetchUsers,
  } = useUsers();

  // Fetch users when filters or pagination changes
  useEffect(() => {
    fetchUsers(getQueryParams(), page, pageSize);
  }, [fetchUsers, getQueryParams, page, pageSize]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "user",
      status: "active",
    });
    setEditingUser(null);
  };

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      await updateUser({ ...formData, id: editingUser.id });
    } else {
      await addUser(formData);
    }

    setModalOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
  };

  return (
    <>
      <Paper shadow="xs" p="md" withBorder className="mb-4">
        <Title order={4} className="mb-3">
          Filters
        </Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            icon={<Search size={16} />}
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
          />

          <Select
            placeholder="Filter by role"
            value={filters.role}
            onChange={(value) =>
              setFilter("role", value as UserFilters["role"])
            }
            data={[
              { value: "", label: "All roles" },
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ]}
            clearable
          />

          <Select
            placeholder="Filter by status"
            value={filters.status}
            onChange={(value) =>
              setFilter("status", value as UserFilters["status"])
            }
            data={[
              { value: "", label: "All statuses" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            clearable
          />
        </div>

        <Divider my="sm" />

        <Group position="apart">
          <Button
            variant="subtle"
            leftIcon={<Filter size={16} />}
            onClick={resetFilters}
          >
            Reset Filters
          </Button>

          <Button leftIcon={<Plus size={16} />} onClick={() => openModal()}>
            Add User
          </Button>
        </Group>
      </Paper>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : error ? (
        <Text c="red">Error loading users: {error.message}</Text>
      ) : (
        <>
          <Paper shadow="xs" withBorder>
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <Text align="center" py="lg">
                        No users found
                      </Text>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <Group spacing="sm">
                          <Avatar
                            size={30}
                            radius={30}
                            src={`https://i.pravatar.cc/150?u=${user.id}`}
                          />
                          <Text size="sm" weight={500}>
                            {user.name}
                          </Text>
                        </Group>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <Badge
                          color={user.role === "admin" ? "purple" : "blue"}
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          color={user.status === "active" ? "green" : "red"}
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td>
                        <Group spacing={0} position="left">
                          <ActionIcon onClick={() => openModal(user)}>
                            <Pencil size={16} />
                          </ActionIcon>
                          <ActionIcon
                            color="red"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash size={16} />
                          </ActionIcon>
                        </Group>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Paper>

          <Box className="flex justify-between items-center mt-4">
            <Text size="sm">
              Showing {users.length} of {total} users
            </Text>

            <Pagination
              total={totalPages}
              value={page}
              onChange={goToPage}
              withEdges
            />
          </Box>
        </>
      )}

      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingUser ? "Edit User" : "Add New User"}
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Name"
            placeholder="Enter name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            mb="md"
          />

          <TextInput
            label="Email"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            mb="md"
          />

          <Select
            label="Role"
            placeholder="Select role"
            value={formData.role}
            onChange={(value) =>
              setFormData({ ...formData, role: value as "user" | "admin" })
            }
            data={[
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ]}
            required
            mb="md"
          />

          <Select
            label="Status"
            placeholder="Select status"
            value={formData.status}
            onChange={(value) =>
              setFormData({
                ...formData,
                status: value as "active" | "inactive",
              })
            }
            data={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            required
            mb="xl"
          />

          <Button type="submit" fullWidth>
            {editingUser ? "Update User" : "Add User"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
