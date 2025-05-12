"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard/layout"
import {
  Title,
  Paper,
  Text,
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Select,
  Switch,
  ColorInput,
  Slider,
  Code,
  Alert,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { useState } from "react"
import { Check, X, AlertCircle, InfoIcon, Bell, MessageSquare, Clock, Trash, Settings, Upload } from "lucide-react"

export default function NotificationsPage() {
  const [autoClose, setAutoClose] = useState(true)

  const form = useForm({
    initialValues: {
      title: "Notification Title",
      message: "This is a notification message that will be displayed to the user.",
      color: "#228be6",
      position: "top-right",
      autoClose: 5000,
      withCloseButton: true,
      withBorder: false,
      icon: "info",
    },
  })

  const showNotification = (values: typeof form.values) => {
    const icons = {
      info: <InfoIcon size={18} />,
      success: <Check size={18} />,
      error: <X size={18} />,
      warning: <AlertCircle size={18} />,
      message: <MessageSquare size={18} />,
      bell: <Bell size={18} />,
      clock: <Clock size={18} />,
      trash: <Trash size={18} />,
      settings: <Settings size={18} />,
      upload: <Upload size={18} />,
    }

    notifications.show({
      title: values.title,
      message: values.message,
      color: values.color,
      icon: icons[values.icon as keyof typeof icons],
      position: values.position as any,
      autoClose: autoClose ? values.autoClose : false,
      withCloseButton: values.withCloseButton,
      withBorder: values.withBorder,
    })
  }

  const showMultipleNotifications = () => {
    notifications.show({
      title: "Success",
      message: "Your file has been uploaded successfully",
      color: "green",
      icon: <Check size={18} />,
    })

    setTimeout(() => {
      notifications.show({
        title: "Processing",
        message: "Your file is being processed",
        color: "blue",
        icon: <InfoIcon size={18} />,
        loading: true,
      })
    }, 1000)

    setTimeout(() => {
      notifications.show({
        title: "Warning",
        message: "Your disk space is running low",
        color: "yellow",
        icon: <AlertCircle size={18} />,
      })
    }, 2000)
  }

  const showUpdateNotification = () => {
    const id = notifications.show({
      title: "Uploading file",
      message: "0% completed",
      color: "blue",
      loading: true,
      autoClose: false,
    })

    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      if (progress <= 100) {
        notifications.update({
          id,
          title: "Uploading file",
          message: `${progress}% completed`,
          color: progress === 100 ? "green" : "blue",
          loading: progress < 100,
          icon: progress === 100 ? <Check size={18} /> : undefined,
        })
      } else {
        clearInterval(interval)
      }
    }, 500)
  }

  const clearAllNotifications = () => {
    notifications.clean()
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <Title order={2} mb="lg">
          Notifications Example
        </Title>

        <Paper withBorder p="md" radius="md" mb="xl">
          <Text>
            This example demonstrates how to use Mantine's notification system to display various types of notifications
            to users.
          </Text>
        </Paper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Paper withBorder p="xl" radius="md">
            <Title order={3} mb="md">
              Notification Builder
            </Title>

            <form
              onSubmit={form.onSubmit((values) => {
                showNotification(values)
              })}
            >
              <Stack spacing="md">
                <TextInput label="Title" placeholder="Notification title" {...form.getInputProps("title")} />

                <Textarea
                  label="Message"
                  placeholder="Notification message"
                  minRows={3}
                  {...form.getInputProps("message")}
                />

                <ColorInput label="Color" {...form.getInputProps("color")} />

                <Select
                  label="Position"
                  data={[
                    { value: "top-left", label: "Top Left" },
                    { value: "top-right", label: "Top Right" },
                    { value: "top-center", label: "Top Center" },
                    { value: "bottom-left", label: "Bottom Left" },
                    { value: "bottom-right", label: "Bottom Right" },
                    { value: "bottom-center", label: "Bottom Center" },
                  ]}
                  {...form.getInputProps("position")}
                />

                <Select
                  label="Icon"
                  data={[
                    { value: "info", label: "Info" },
                    { value: "success", label: "Success" },
                    { value: "error", label: "Error" },
                    { value: "warning", label: "Warning" },
                    { value: "message", label: "Message" },
                    { value: "bell", label: "Bell" },
                    { value: "clock", label: "Clock" },
                    { value: "trash", label: "Trash" },
                    { value: "settings", label: "Settings" },
                    { value: "upload", label: "Upload" },
                  ]}
                  {...form.getInputProps("icon")}
                />

                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Auto Close (in ms)
                  </Text>
                  <Group align="center" mb="xs">
                    <Switch
                      label="Enable auto close"
                      checked={autoClose}
                      onChange={(event) => setAutoClose(event.currentTarget.checked)}
                    />
                  </Group>
                  {autoClose && (
                    <Slider
                      min={1000}
                      max={10000}
                      step={1000}
                      marks={[
                        { value: 1000, label: "1s" },
                        { value: 5000, label: "5s" },
                        { value: 10000, label: "10s" },
                      ]}
                      disabled={!autoClose}
                      {...form.getInputProps("autoClose")}
                    />
                  )}
                </div>

                <Group>
                  <Switch label="Show close button" {...form.getInputProps("withCloseButton", { type: "checkbox" })} />
                  <Switch label="With border" {...form.getInputProps("withBorder", { type: "checkbox" })} />
                </Group>

                <Group position="right" mt="md">
                  <Button type="submit">Show Notification</Button>
                </Group>
              </Stack>
            </form>
          </Paper>

          <div>
            <Paper withBorder p="xl" radius="md" mb="lg">
              <Title order={3} mb="md">
                Notification Examples
              </Title>

              <Stack spacing="md">
                <Button
                  fullWidth
                  leftSection={<Bell size={16} />}
                  onClick={() =>
                    notifications.show({
                      title: "Default notification",
                      message: "This is a default notification with no special styling",
                    })
                  }
                >
                  Default Notification
                </Button>

                <Button
                  fullWidth
                  color="green"
                  leftSection={<Check size={16} />}
                  onClick={() =>
                    notifications.show({
                      title: "Success",
                      message: "Your action was completed successfully!",
                      color: "green",
                      icon: <Check size={18} />,
                    })
                  }
                >
                  Success Notification
                </Button>

                <Button
                  fullWidth
                  color="red"
                  leftSection={<X size={16} />}
                  onClick={() =>
                    notifications.show({
                      title: "Error",
                      message: "There was an error processing your request",
                      color: "red",
                      icon: <X size={18} />,
                    })
                  }
                >
                  Error Notification
                </Button>

                <Button
                  fullWidth
                  color="yellow"
                  leftSection={<AlertCircle size={16} />}
                  onClick={() =>
                    notifications.show({
                      title: "Warning",
                      message: "This action might have unexpected consequences",
                      color: "yellow",
                      icon: <AlertCircle size={18} />,
                    })
                  }
                >
                  Warning Notification
                </Button>

                <Button
                  fullWidth
                  color="blue"
                  leftSection={<InfoIcon size={16} />}
                  onClick={() =>
                    notifications.show({
                      title: "Information",
                      message: "Here's some information you might find useful",
                      color: "blue",
                      icon: <InfoIcon size={18} />,
                    })
                  }
                >
                  Info Notification
                </Button>

                <Button
                  fullWidth
                  color="grape"
                  leftSection={<Upload size={16} />}
                  onClick={() =>
                    notifications.show({
                      title: "Loading",
                      message: "Please wait while we process your request",
                      color: "grape",
                      loading: true,
                      autoClose: false,
                    })
                  }
                >
                  Loading Notification
                </Button>
              </Stack>
            </Paper>

            <Paper withBorder p="xl" radius="md">
              <Title order={3} mb="md">
                Advanced Features
              </Title>

              <Stack spacing="md">
                <Button fullWidth onClick={showMultipleNotifications}>
                  Show Multiple Notifications
                </Button>

                <Button fullWidth onClick={showUpdateNotification}>
                  Show Progress Notification
                </Button>

                <Button fullWidth color="red" onClick={clearAllNotifications}>
                  Clear All Notifications
                </Button>
              </Stack>
            </Paper>
          </div>
        </div>

        <Paper withBorder p="xl" radius="md" mt="xl">
          <Title order={3} mb="md">
            Usage Example
          </Title>

          <Alert icon={<InfoIcon size={16} />} title="How to use notifications in your code" color="blue" mb="md">
            <Text mb="md">
              To use notifications in your application, you need to add the NotificationsProvider to your app and then
              use the notifications API.
            </Text>

            <Code block>
              {`// In your layout or provider component
import { NotificationsProvider } from '@mantine/notifications';

export function Layout({ children }) {
  return (
    <NotificationsProvider>
      {children}
    </NotificationsProvider>
  );
}

// In your component
import { notifications } from '@mantine/notifications';

function MyComponent() {
  const showNotification = () => {
    notifications.show({
      title: 'Success',
      message: 'Your action was completed successfully!',
      color: 'green',
      icon: <Check size={18} />,
    });
  };

  return <Button onClick={showNotification}>Show Notification</Button>;
}`}
            </Code>
          </Alert>
        </Paper>
      </DashboardLayout>
    </AuthGuard>
  )
}
