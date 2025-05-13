"use client";

import type React from "react";

import { AuthGuard } from "@/src/components/auth-guard";
import { DashboardLayout } from "@/src/components/dashboard/layout";
import {
  Title,
  Paper,
  Text,
  Tabs,
  Code,
  Button,
  TextInput,
  Group,
  Loader,
  Alert,
  Badge,
  Card,
  Avatar,
  Divider,
  Accordion,
} from "@mantine/core";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Check,
  Search,
  RefreshCw,
  User,
  Users,
  Database,
  Server,
} from "lucide-react";

// Types for the GitHub API
interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

// API functions
const fetchGithubUser = async (username: string): Promise<GithubUser> => {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) {
    throw new Error("User not found");
  }
  return response.json();
};

const fetchGithubRepos = async (username: string): Promise<GithubRepo[]> => {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch repositories");
  }
  return response.json();
};

// Mock API for demonstration purposes
const createTodo = async (todo: { title: string; completed: boolean }) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { id: Date.now(), ...todo };
};

export default function ApiIntegrationPage() {
  const [username, setUsername] = useState("vercel");
  const [searchTerm, setSearchTerm] = useState("vercel");
  const [todoTitle, setTodoTitle] = useState("");
  const queryClient = useQueryClient();

  // GitHub user query
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["githubUser", searchTerm],
    queryFn: () => fetchGithubUser(searchTerm),
    enabled: !!searchTerm,
    staleTime: 60000, // 1 minute
  });

  // GitHub repos query
  const {
    data: repos,
    isLoading: isReposLoading,
    error: reposError,
    refetch: refetchRepos,
  } = useQuery({
    queryKey: ["githubRepos", searchTerm],
    queryFn: () => fetchGithubRepos(searchTerm),
    enabled: !!searchTerm,
    staleTime: 60000, // 1 minute
  });

  // Todo mutation
  const todoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // In a real app, you would invalidate the todos query
      // queryClient.invalidateQueries({ queryKey: ['todos'] })
      setTodoTitle("");
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(username);
  };

  const handleRefresh = () => {
    refetchUser();
    refetchRepos();
  };

  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (todoTitle.trim()) {
      todoMutation.mutate({ title: todoTitle, completed: false });
    }
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <Title order={2} mb="lg">
          API Integration Example
        </Title>

        <Paper withBorder p="md" radius="md" mb="xl">
          <Text>
            This example demonstrates different approaches to API integration
            using TanStack Query (React Query) for data fetching, caching, and
            state management.
          </Text>
        </Paper>

        <Tabs defaultValue="github">
          <Tabs.List mb="xl">
            <Tabs.Tab value="github" leftSection={<Users size={16} />}>
              GitHub API
            </Tabs.Tab>
            <Tabs.Tab value="mutation" leftSection={<Database size={16} />}>
              Mutations
            </Tabs.Tab>
            <Tabs.Tab value="patterns" leftSection={<Server size={16} />}>
              API Patterns
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="github">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <Paper withBorder p="xl" radius="md">
                  <Title order={3} mb="md">
                    GitHub User Search
                  </Title>

                  <form onSubmit={handleSearch}>
                    <TextInput
                      label="GitHub Username"
                      placeholder="Enter a GitHub username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      leftSection={<Search size={16} />}
                      mb="md"
                    />

                    <Group position="apart">
                      <Button type="submit">Search</Button>
                      <Button
                        variant="light"
                        leftSection={<RefreshCw size={16} />}
                        onClick={handleRefresh}
                      >
                        Refresh
                      </Button>
                    </Group>
                  </form>
                </Paper>
              </div>

              <div className="md:col-span-2">
                {isUserLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader />
                  </div>
                ) : userError ? (
                  <Alert
                    icon={<AlertCircle size={16} />}
                    title="Error"
                    color="red"
                  >
                    {(userError as Error).message}
                  </Alert>
                ) : user ? (
                  <div>
                    <Card withBorder p="xl" radius="md" mb="lg">
                      <Group position="apart" mb="md">
                        <Group>
                          <Avatar src={user.avatar_url} size="xl" radius="xl" />
                          <div>
                            <Text size="xl" fw={700}>
                              {user.name || user.login}
                            </Text>
                            <Text size="sm" c="dimmed">
                              @{user.login}
                            </Text>
                            {user.bio && <Text mt="xs">{user.bio}</Text>}
                          </div>
                        </Group>
                        <Button
                          component="a"
                          href={user.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outline"
                        >
                          View Profile
                        </Button>
                      </Group>

                      <Divider my="md" />

                      <Group position="apart">
                        <div>
                          <Text size="sm" c="dimmed">
                            Repositories
                          </Text>
                          <Text fw={700}>{user.public_repos}</Text>
                        </div>
                        <div>
                          <Text size="sm" c="dimmed">
                            Followers
                          </Text>
                          <Text fw={700}>{user.followers}</Text>
                        </div>
                        <div>
                          <Text size="sm" c="dimmed">
                            Following
                          </Text>
                          <Text fw={700}>{user.following}</Text>
                        </div>
                      </Group>
                    </Card>

                    <Title order={3} mb="md">
                      Recent Repositories
                    </Title>

                    {isReposLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader />
                      </div>
                    ) : reposError ? (
                      <Alert
                        icon={<AlertCircle size={16} />}
                        title="Error"
                        color="red"
                      >
                        {(reposError as Error).message}
                      </Alert>
                    ) : repos && repos.length > 0 ? (
                      <div className="space-y-4">
                        {repos.map((repo) => (
                          <Card key={repo.id} withBorder p="md" radius="md">
                            <Group position="apart" mb="xs">
                              <Text fw={700}>{repo.name}</Text>
                              <Group spacing={8}>
                                <Badge color="yellow">
                                  ★ {repo.stargazers_count}
                                </Badge>
                                <Badge color="blue">
                                  🍴 {repo.forks_count}
                                </Badge>
                                {repo.language && (
                                  <Badge>{repo.language}</Badge>
                                )}
                              </Group>
                            </Group>
                            {repo.description && (
                              <Text size="sm" c="dimmed" mb="md">
                                {repo.description}
                              </Text>
                            )}
                            <Group position="apart">
                              <Text size="xs" c="dimmed">
                                Updated:{" "}
                                {new Date(repo.updated_at).toLocaleDateString()}
                              </Text>
                              <Button
                                component="a"
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="subtle"
                                size="xs"
                              >
                                View Repository
                              </Button>
                            </Group>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Alert color="blue">No repositories found</Alert>
                    )}
                  </div>
                ) : (
                  <Alert
                    icon={<User size={16} />}
                    title="No user selected"
                    color="blue"
                  >
                    Enter a GitHub username and click Search to view user
                    information.
                  </Alert>
                )}
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="mutation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Paper withBorder p="xl" radius="md">
                <Title order={3} mb="md">
                  Mutation Example
                </Title>

                <Text mb="lg">
                  This example demonstrates how to use mutations to create,
                  update, or delete data. In this case, we're creating a todo
                  item.
                </Text>

                <form onSubmit={handleCreateTodo}>
                  <TextInput
                    label="Todo Title"
                    placeholder="Enter a todo title"
                    value={todoTitle}
                    onChange={(e) => setTodoTitle(e.target.value)}
                    mb="md"
                  />

                  <Button
                    type="submit"
                    loading={todoMutation.isPending}
                    disabled={!todoTitle.trim() || todoMutation.isPending}
                  >
                    Create Todo
                  </Button>
                </form>

                {todoMutation.isSuccess && (
                  <Alert
                    icon={<Check size={16} />}
                    title="Success"
                    color="green"
                    mt="md"
                  >
                    Todo created successfully!
                    <pre className="mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs">
                      {JSON.stringify(todoMutation.data, null, 2)}
                    </pre>
                  </Alert>
                )}

                {todoMutation.isError && (
                  <Alert
                    icon={<AlertCircle size={16} />}
                    title="Error"
                    color="red"
                    mt="md"
                  >
                    {(todoMutation.error as Error).message}
                  </Alert>
                )}
              </Paper>

              <Paper withBorder p="xl" radius="md">
                <Title order={3} mb="md">
                  Using Mutations
                </Title>

                <Text mb="md">
                  Mutations are used to create, update, or delete data. Here's
                  how to use mutations with TanStack Query:
                </Text>

                <Code block>
                  {`import { useMutation, useQueryClient } from '@tanstack/react-query';

// API function
const createTodo = async (todo) => {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  
  return response.json();
};

function TodoForm() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // Invalidate and refetch the todos query
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title: 'New Todo', completed: false });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Todo'}
      </button>
    </form>
  );
}`}
                </Code>
              </Paper>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="patterns">
            <Paper withBorder p="xl" radius="md">
              <Title order={3} mb="md">
                API Integration Patterns
              </Title>

              <Text mb="lg">
                Here are some common patterns and best practices for API
                integration in Next.js applications.
              </Text>

              <Accordion>
                <Accordion.Item value="setup">
                  <Accordion.Control>
                    Setting up TanStack Query
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text mb="md">
                      To set up TanStack Query in your Next.js application, you
                      need to create a QueryProvider component and wrap your
                      application with it.
                    </Text>

                    <Code block>
                      {`// lib/query-provider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}`}
                    </Code>

                    <Text mt="md" mb="md">
                      Then, wrap your application with the QueryProvider in your
                      layout or app component:
                    </Text>

                    <Code block>
                      {`// app/layout.tsx
import { QueryProvider } from '@/lib/query-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}`}
                    </Code>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="api-client">
                  <Accordion.Control>Creating an API Client</Accordion.Control>
                  <Accordion.Panel>
                    <Text mb="md">
                      It's a good practice to create a centralized API client
                      for your application. This makes it easier to handle
                      authentication, error handling, and other common concerns.
                    </Text>

                    <Code block>
                      {`// lib/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;`}
                    </Code>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="custom-hooks">
                  <Accordion.Control>Creating Custom Hooks</Accordion.Control>
                  <Accordion.Panel>
                    <Text mb="md">
                      Create custom hooks for your API calls to encapsulate the
                      logic and make it reusable across your application.
                    </Text>

                    <Code block>
                      {`// hooks/use-users.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

// Fetch users
const fetchUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

// Create user
const createUser = async (user) => {
  const response = await apiClient.post('/users', user);
  return response.data;
};

// Update user
const updateUser = async ({ id, ...data }) => {
  const response = await apiClient.put(\`/users/\${id}\`, data);
  return response.data;
};

// Delete user
const deleteUser = async (id) => {
  await apiClient.delete(\`/users/\${id}\`);
  return id;
};

export function useUsers() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
  };
}`}
                    </Code>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="server-actions">
                  <Accordion.Control>Using Server Actions</Accordion.Control>
                  <Accordion.Panel>
                    <Text mb="md">
                      In Next.js 14, you can use Server Actions to handle API
                      calls directly from your components without creating
                      separate API routes.
                    </Text>

                    <Code block>
                      {`// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export async function createUser(formData: FormData) {
  const validatedFields = UserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid input',
      fields: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Save to database
    await db.user.create({
      data: validatedFields.data,
    });

    // Revalidate the users page
    revalidatePath('/users');
    
    return { success: true };
  } catch (error) {
    return {
      error: 'Failed to create user',
    };
  }
}`}
                    </Code>

                    <Text mt="md" mb="md">
                      Then use the server action in your component:
                    </Text>

                    <Code block>
                      {`// app/users/new/page.tsx
'use client'

import { createUser } from '@/app/actions';
import { useFormState } from 'react-dom';

const initialState = {
  error: null,
  fields: {},
  success: false,
};

export default function NewUserPage() {
  const [state, formAction] = useFormState(createUser, initialState);

  return (
    <form action={formAction}>
      <input name="name" placeholder="Name" />
      {state.fields?.name && <p className="text-red-500">{state.fields.name}</p>}
      
      <input name="email" placeholder="Email" />
      {state.fields?.email && <p className="text-red-500">{state.fields.email}</p>}
      
      <button type="submit">Create User</button>
      
      {state.error && <p className="text-red-500">{state.error}</p>}
      {state.success && <p className="text-green-500">User created successfully!</p>}
    </form>
  );
}`}
                    </Code>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="error-handling">
                  <Accordion.Control>Error Handling</Accordion.Control>
                  <Accordion.Panel>
                    <Text mb="md">
                      Proper error handling is crucial for a good user
                      experience. Here's how to handle errors with TanStack
                      Query:
                    </Text>

                    <Code block>
                      {`function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Alert color="red" title="Error">
        {error.message || 'Failed to load users'}
      </Alert>
    );
  }

  return (
    <div>
      {data.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}`}
                    </Code>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="optimistic-updates">
                  <Accordion.Control>Optimistic Updates</Accordion.Control>
                  <Accordion.Panel>
                    <Text mb="md">
                      Optimistic updates improve the user experience by updating
                      the UI before the server confirms the change.
                    </Text>

                    <Code block>
                      {`function TodoList() {
  const queryClient = useQueryClient();
  const { data: todos } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const toggleTodoMutation = useMutation({
    mutationFn: toggleTodo,
    // Optimistically update the todo
    onMutate: async (toggledTodo) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(['todos']);

      // Optimistically update to the new value
      queryClient.setQueryData(['todos'], old => 
        old.map(todo => 
          todo.id === toggledTodo.id 
            ? { ...todo, completed: !todo.completed } 
            : todo
        )
      );

      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos);
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodoMutation.mutate({ id: todo.id })}
          />
          {todo.title}
        </div>
      ))}
    </div>
  );
}`}
                    </Code>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </DashboardLayout>
    </AuthGuard>
  );
}
