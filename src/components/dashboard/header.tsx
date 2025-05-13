"use client";

import { useState } from "react";
import { useAuth } from "@/src/context/auth-context";
import {
  Avatar,
  Menu,
  Text,
  UnstyledButton,
  Group,@/src/components/ui/theme-toggle
  TextInput,
  ActionIcon,
  Box,
} from "@mantine/core";
import {
  ChevronDown,
  User,
  Settings,
  LogOutIcon as Logout,
  Bell,
  Search,
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import ThemeToggle with no SSR to prevent hydration issues
const ThemeToggle = dynamic(
  () => import("@/components/ui/theme-toggle").then((mod) => mod.ThemeToggle),
  {
    ssr: false,
  }
);

export function DashboardHeader({
  sidebarWidth = 250,
}: {
  sidebarWidth?: number;
}) {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { user, logout } = useAuth();

  return (
    <Box
      className="h-[60px] fixed top-0 right-0 z-20 transition-all duration-300 flex items-center justify-between px-4"
      style={{
        left: `${sidebarWidth}px`,
        borderBottom: "1px solid var(--mantine-color-gray-3)",
        backgroundColor: "var(--mantine-color-body)",
      }}
    >
      <Box className="flex-1 max-w-xl">
        <TextInput
          placeholder="Search examples..."
          leftSection={<Search size={16} />}
          size="sm"
          radius="md"
          className="w-full"
        />
      </Box>

      <Group>
        <ActionIcon
          variant="subtle"
          radius="xl"
          size="lg"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </ActionIcon>

        <ThemeToggle />

        <Menu
          width={260}
          position="bottom-end"
          transitionProps={{ transition: "pop-top-right" }}
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
          withinPortal
        >
          <Menu.Target>
            <UnstyledButton
              className="flex items-center px-2 py-1 rounded-md"
              style={{
                backgroundColor: userMenuOpened
                  ? "var(--mantine-color-gray-1)"
                  : "transparent",
              }}
            >
              <Group gap={7}>
                <Avatar
                  src={`https://i.pravatar.cc/150?u=${user?.id}`}
                  alt={user?.name}
                  radius="xl"
                  size={30}
                />
                <div className="hidden md:block">
                  <Text fw={500} size="sm">
                    {user?.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {user?.email}
                  </Text>
                </div>
                <ChevronDown size={12} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<User size={14} />}>Profile</Menu.Item>
            <Menu.Item leftSection={<Settings size={14} />}>Settings</Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<Logout size={14} />}
              onClick={logout}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  );
}
