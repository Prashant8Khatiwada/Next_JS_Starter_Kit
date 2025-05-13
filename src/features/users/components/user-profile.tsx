"use client"

import { Card, Avatar, Text, Skeleton } from "@mantine/core"
import { useUser } from "../hooks/use-user"

interface UserProfileProps {
  userId: string
}

export function UserProfile({ userId }: UserProfileProps) {
  const { user, isLoading, error } = useUser(userId)

  if (isLoading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full">
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton height={50} circle />
          <div>
            <Skeleton height={20} width={150} mb={8} />
            <Skeleton height={15} width={100} />
          </div>
        </div>
        <Skeleton height={15} mb={10} />
        <Skeleton height={15} mb={10} />
        <Skeleton height={15} width="70%" />
      </Card>
    )
  }

  if (error) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full">
        <Text c="red">Error loading user data</Text>
      </Card>
    )
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full">
      <div className="flex items-center space-x-4 mb-4">
        <Avatar size="lg" radius="xl" src={user?.avatar} alt={user?.name} />
        <div>
          <Text fw={500}>{user?.name}</Text>
          <Text size="sm" c="dimmed">
            {user?.email}
          </Text>
        </div>
      </div>
      <Text size="sm">This component demonstrates TanStack Query for data fetching with loading states.</Text>
    </Card>
  )
}
