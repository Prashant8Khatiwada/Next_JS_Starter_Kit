"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/src/components/dashboard/layout";
import {
  Card,
  Text,
  Group,
  Title,
  Paper,
  SimpleGrid,
  Loader,
  Button,
  Center,
} from "@mantine/core";
import {
  ArrowRight,
  LayoutTemplate,
  Table2,
  Upload,
  Infinity,
  SlidersHorizontal,
  Layers,
} from "lucide-react";
import Link from "next/link";

interface ExampleCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const examples: ExampleCard[] = [
    {
      title: "Reusable Table",
      description:
        "A powerful table component with sorting, filtering, and pagination.",
      icon: <Table2 size={24} />,
      link: "/examples/reusable-table",
    },
    {
      title: "File Upload",
      description:
        "File upload component with drag and drop support and progress tracking.",
      icon: <Upload size={24} />,
      link: "/examples/file-upload",
    },
    {
      title: "Infinite Scroll",
      description:
        "Load more content automatically as the user scrolls down the page.",
      icon: <Infinity size={24} />,
      link: "/examples/infinite-scroll",
    },
    {
      title: "Advanced Filtering",
      description:
        "Complex filtering UI with multiple filter types and real-time updates.",
      icon: <SlidersHorizontal size={24} />,
      link: "/examples/filtering",
    },
    {
      title: "Layout Examples",
      description:
        "Various layout patterns for different types of applications.",
      icon: <LayoutTemplate size={24} />,
      link: "/dashboard",
    },
    {
      title: "UI Components",
      description:
        "Collection of reusable UI components built with Mantine and Tailwind.",
      icon: <Layers size={24} />,
      link: "/examples/components",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <Center style={{ height: "calc(100vh - 120px)" }}>
          <Loader size="xl" />
        </Center>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Paper p="xl" radius="md" mb="xl" withBorder>
        <Title order={2} mb="sm">
          Next.js Starter Kit
        </Title>
        <Text mb="lg">
          Welcome to the Next.js Starter Kit with Mantine UI, Tailwind CSS, and
          TanStack Query. Explore the examples below to see what you can build
          with this starter kit.
        </Text>
      </Paper>

      <Title order={3} mb="md">
        Examples
      </Title>

      <SimpleGrid
        cols={3}
        spacing="lg"
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "xs", cols: 1 },
        ]}
      >
        {examples.map((example, index) => (
          <Card key={index} withBorder padding="lg" radius="md">
            <Card.Section withBorder inheritPadding py="xs">
              <Group>
                <div
                  style={{
                    backgroundColor: "var(--mantine-color-blue-0)",
                    color: "var(--mantine-color-blue-6)",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {example.icon}
                </div>
                <Text fw={500} size="lg">
                  {example.title}
                </Text>
              </Group>
            </Card.Section>

            <Text mt="md" mb="md" size="sm">
              {example.description}
            </Text>

            <Button
              component={Link}
              href={example.link}
              variant="light"
              color="blue"
              fullWidth
              mt="md"
              rightSection={<ArrowRight size={14} />}
            >
              View Example
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </DashboardLayout>
  );
}
