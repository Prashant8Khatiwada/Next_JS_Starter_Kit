"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import {
  Title,
  Text,
  Paper,
  Button,
  Group,
  Badge,
  Card,
  Avatar,
  Tabs,
  TextInput,
  Checkbox,
  Switch,
  Select,
  Slider,
  Progress,
  Accordion,
  Alert,
  Tooltip,
  Divider,
  SimpleGrid,
} from "@mantine/core"
import { AlertCircle, Check, InfoIcon, Search, Settings, User } from "lucide-react"

export default function ComponentsPage() {
  return (
    <DashboardLayout>
      <Title order={2} mb="lg">
        UI Components
      </Title>

      <Paper withBorder p="md" radius="md" mb="xl">
        <Text>
          This page showcases various UI components available in this starter kit. These components are built with
          Mantine UI and enhanced with Tailwind CSS.
        </Text>
      </Paper>

      <SimpleGrid cols={2} spacing="lg" breakpoints={[{ maxWidth: "md", cols: 1 }]}>
        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="md">
            Buttons
          </Title>
          <Group mb="md">
            <Button>Default</Button>
            <Button variant="light">Light</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="transparent">Transparent</Button>
          </Group>
          <Group mb="md">
            <Button color="blue">Blue</Button>
            <Button color="green">Green</Button>
            <Button color="red">Red</Button>
            <Button color="yellow">Yellow</Button>
            <Button color="grape">Grape</Button>
          </Group>
          <Group>
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="md">MD</Button>
            <Button size="lg">LG</Button>
            <Button size="xl">XL</Button>
          </Group>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="md">
            Badges
          </Title>
          <Group mb="md">
            <Badge>Default</Badge>
            <Badge color="blue">Blue</Badge>
            <Badge color="green">Green</Badge>
            <Badge color="red">Red</Badge>
            <Badge color="yellow">Yellow</Badge>
          </Group>
          <Group mb="md">
            <Badge variant="light">Light</Badge>
            <Badge variant="filled">Filled</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="dot">Dot</Badge>
          </Group>
          <Group>
            <Badge size="xs">XS</Badge>
            <Badge size="sm">SM</Badge>
            <Badge size="md">MD</Badge>
            <Badge size="lg">LG</Badge>
            <Badge size="xl">XL</Badge>
          </Group>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="md">
            Cards
          </Title>
          <SimpleGrid cols={2} spacing="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Text fw={500}>Card Title</Text>
                  <Badge color="blue">New</Badge>
                </Group>
              </Card.Section>

              <Text size="sm" mt="md">
                This is a simple card with a title and some content. You can use it to display information.
              </Text>

              <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                Action
              </Button>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group>
                <Avatar color="blue" radius="xl">
                  JD
                </Avatar>
                <div>
                  <Text fw={500}>John Doe</Text>
                  <Text size="xs" c="dimmed">
                    Software Engineer
                  </Text>
                </div>
              </Group>
              <Divider my="sm" />
              <Text size="sm">This card shows a user profile with an avatar and some information about the user.</Text>
            </Card>
          </SimpleGrid>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="md">
            Tabs
          </Title>
          <Tabs defaultValue="account">
            <Tabs.List>
              <Tabs.Tab value="account" leftSection={<User size={16} />}>
                Account
              </Tabs.Tab>
              <Tabs.Tab value="settings" leftSection={<Settings size={16} />}>
                Settings
              </Tabs.Tab>
              <Tabs.Tab value="info" leftSection={<InfoIcon size={16} />}>
                Information
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="account" pt="xs">
              <Text mt="md">Account settings and preferences</Text>
            </Tabs.Panel>

            <Tabs.Panel value="settings" pt="xs">
              <Text mt="md">Application settings and configuration</Text>
            </Tabs.Panel>

            <Tabs.Panel value="info" pt="xs">
              <Text mt="md">Information about the application</Text>
            </Tabs.Panel>
          </Tabs>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="md">
            Form Elements
          </Title>
          <SimpleGrid cols={1} spacing="md">
            <TextInput label="Name" placeholder="Enter your name" />
            <TextInput label="Email" placeholder="your@email.com" leftSection={<Search size={16} />} />
            <Select
              label="Country"
              placeholder="Select your country"
              data={["United States", "Canada", "United Kingdom", "Australia", "Germany"]}
            />
            <Checkbox label="I agree to the terms and conditions" />
            <Switch label="Enable notifications" />
            <Slider
              marks={[
                { value: 20, label: "20%" },
                { value: 50, label: "50%" },
                { value: 80, label: "80%" },
              ]}
              defaultValue={40}
            />
          </SimpleGrid>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="md">
            Progress & Indicators
          </Title>
          <Text mb="xs">Basic Progress</Text>
          <Progress value={60} mb="md" />

          <Text mb="xs">Segmented Progress</Text>
          <Progress.Root size="xl" mb="md">
            <Tooltip label="Documents - 35%">
              <Progress.Section value={35} color="cyan">
                <Progress.Label>Documents</Progress.Label>
              </Progress.Section>
            </Tooltip>
            <Tooltip label="Images - 25%">
              <Progress.Section value={25} color="pink">
                <Progress.Label>Images</Progress.Label>
              </Progress.Section>
            </Tooltip>
            <Tooltip label="Videos - 15%">
              <Progress.Section value={15} color="orange">
                <Progress.Label>Videos</Progress.Label>
              </Progress.Section>
            </Tooltip>
          </Progress.Root>

          <Text mb="xs">Animated Progress</Text>
          <Progress value={80} color="green" striped animation="animate" mb="md" />
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="md">
            Accordion
          </Title>
          <Accordion>
            <Accordion.Item value="item1">
              <Accordion.Control>What is this starter kit?</Accordion.Control>
              <Accordion.Panel>
                This is a Next.js starter kit with Mantine UI, Tailwind CSS, and TanStack Query. It provides a solid
                foundation for building modern web applications.
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="item2">
              <Accordion.Control>How do I customize the theme?</Accordion.Control>
              <Accordion.Panel>
                You can customize the theme by modifying the tailwind.config.ts file and the globals.css file. You can
                also use Mantine's theming system to customize the components.
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="item3">
              <Accordion.Control>Is this starter kit free to use?</Accordion.Control>
              <Accordion.Panel>
                Yes, this starter kit is completely free to use for both personal and commercial projects. You can
                modify it and use it as you wish.
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="md">
            Alerts
          </Title>
          <Alert icon={<InfoIcon size={16} />} title="Information" color="blue" mb="md">
            This is an informational alert. It provides useful information to the user.
          </Alert>

          <Alert icon={<Check size={16} />} title="Success" color="green" mb="md">
            Your action was completed successfully. Everything worked as expected.
          </Alert>

          <Alert icon={<AlertCircle size={16} />} title="Warning" color="yellow" mb="md">
            This is a warning alert. Please be careful with your next actions.
          </Alert>

          <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
            An error occurred while processing your request. Please try again.
          </Alert>
        </Paper>
      </SimpleGrid>
    </DashboardLayout>
  )
}
