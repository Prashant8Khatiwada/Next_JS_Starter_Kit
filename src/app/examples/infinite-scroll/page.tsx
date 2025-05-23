"use client";

import { AuthGuard } from "@/src/components/auth-guard";
import {
  Title,
  Paper,
  Text,
  Card,
  Group,
  Avatar,
  Badge,
  Loader,
} from "@mantine/core";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/src/components/dashboard/layout";

// Post type from JSONPlaceholder API
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  user?: {
    name: string;
    username: string;
  };
}

// User type from JSONPlaceholder API
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default function InfiniteScrollPage() {
  const [users, setUsers] = useState<Record<number, User>>({});

  // Fetch users once to associate with posts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data: User[] = await response.json();

        // Create a map of userId to user
        const usersMap = data.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {} as Record<number, User>);

        setUsers(usersMap);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch posts with pagination
  const fetchPosts = async (page: number, limit: number): Promise<Post[]> => {
    const start = (page - 1) * limit;
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`
    );
    const posts: Post[] = await response.json();

    // Add user data to each post
    return posts.map((post) => ({
      ...post,
      user: users[post.userId],
    }));
  };

  const {
    items: posts,
    loading,
    error,
    lastItemRef,
    hasMore,
  } = useInfiniteScroll<Post>({
    fetchFn: fetchPosts,
    initialLimit: 10,
  });

  if (error) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <Title order={2} mb="lg">
            Infinite Scroll Example
          </Title>
          <Text c="red">Error: {error.message}</Text>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <Title order={2} mb="lg">
          Infinite Scroll Example
        </Title>

        <Paper withBorder p="md" radius="md" mb="xl">
          <Text>
            This example demonstrates infinite scrolling using real data from
            JSONPlaceholder API. Scroll down to load more posts automatically.
          </Text>
        </Paper>

        <div className="space-y-4">
          {posts.map((post, index) => (
            <Card
              key={`${post.id}-${index}`}
              withBorder
              p="lg"
              radius="md"
              ref={index === posts.length - 1 ? lastItemRef : null}
            >
              <Group justify="apart" mb="xs">
                <Group>
                  <Avatar color="blue" radius="xl">
                    {post.user?.name?.charAt(0) || "?"}
                  </Avatar>
                  <div>
                    <Text fw={500}>{post.title}</Text>
                    <Text size="xs" c="dimmed">
                      {post.user?.name || "Unknown User"}
                      {post.user?.username && (
                        <span> (@{post.user.username})</span>
                      )}
                    </Text>
                  </div>
                </Group>
                <Badge color="blue">Post #{post.id}</Badge>
              </Group>

              <Text size="sm" c="dimmed">
                {post.body}
              </Text>
            </Card>
          ))}

          {loading && (
            <div className="flex justify-center py-4">
              <Loader />
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <Text ta="center" c="dimmed" size="sm" py="md">
              No more posts to load
            </Text>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
