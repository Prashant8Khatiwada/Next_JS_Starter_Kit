"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/context/theme-context"
import { Sun, Moon, Monitor } from "lucide-react"
import { Button, Tooltip, Popover, Stack, Text, ActionIcon } from "@mantine/core"

export function ThemeToggle() {
  // Use state to track if component is mounted
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme, setTheme } = useTheme() // Move hook call outside conditional

  // Only run on client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't try to access the theme context until the component is mounted
  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <ActionIcon variant="subtle" size="lg" radius="xl" className="opacity-0" aria-hidden="true">
        <span className="h-[1.2rem] w-[1.2rem]"></span>
      </ActionIcon>
    )
  }

  return (
    <Popover width={200} position="bottom-end" shadow="md">
      <Popover.Target>
        <Tooltip label="Change theme">
          <ActionIcon
            variant="subtle"
            size="lg"
            radius="xl"
            aria-label="Toggle theme"
            onClick={toggleTheme} // Added the onClick handler here
          >
            {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
            <span className="sr-only">Toggle theme</span>
          </ActionIcon>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="xs">
          <Text size="sm" fw={500} className="mb-1">
            Appearance
          </Text>
          <Button
            variant={theme === "light" ? "filled" : "subtle"}
            leftSection={<Sun size={16} />}
            onClick={() => setTheme("light")}
            fullWidth
            className="justify-start"
            size="sm"
          >
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "filled" : "subtle"}
            leftSection={<Moon size={16} />}
            onClick={() => setTheme("dark")}
            fullWidth
            className="justify-start"
            size="sm"
          >
            Dark
          </Button>
          <Button
            variant="subtle"
            leftSection={<Monitor size={16} />}
            onClick={() => {
              const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
              setTheme(prefersDark ? "dark" : "light")
            }}
            fullWidth
            className="justify-start"
            size="sm"
          >
            System
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
