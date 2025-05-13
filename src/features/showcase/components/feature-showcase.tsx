"use client";

import { Card, Text, Button, Group, Badge } from "@mantine/core";
import { useTheme } from "@/src/context/theme-context";

export function FeatureShowcase() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full">
      <Card.Section className="bg-blue-50 dark:bg-blue-900 p-4">
        <Text fw={500} size="lg" className="mb-2">
          Feature Showcase
        </Text>
      </Card.Section>

      <Group mt="md" mb="xs">
        <Badge color="blue">Mantine UI</Badge>
        <Badge color="cyan">Tailwind CSS</Badge>
        <Badge color="green">TanStack Query</Badge>
        <Badge color="yellow">Context API</Badge>
      </Group>

      <Text size="sm" c="dimmed" className="mb-4">
        This component demonstrates the integration of Mantine UI components
        with Tailwind CSS classes. It also uses the Theme Context for state
        management.
      </Text>

      <Button
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        onClick={toggleTheme}
      >
        Toggle Theme (Current: {theme})
      </Button>
    </Card>
  );
}
