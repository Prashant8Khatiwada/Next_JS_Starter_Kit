"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Container, Group, Burger, Drawer, UnstyledButton, Avatar, Menu, Text, Button } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useAuth } from "@/context/auth-context"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import { Logo } from "@/components/layout/logo"
import dynamic from "next/dynamic"

// Dynamically import ThemeToggle with no SSR to prevent hydration issues
const ThemeToggle = dynamic(() => import("@/components/ui/theme-toggle").then((mod) => mod.ThemeToggle), {
  ssr: false,
})

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false)
  const [userMenuOpened, setUserMenuOpened] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()

  const isLinkActive = (path: string) => pathname === path

  const links = [
    { link: "/", label: "Home" },
    ...(isAuthenticated
      ? [
          { link: "/dashboard", label: "Dashboard" },
          { link: "/examples/reusable-table", label: "Table Example" },
          { link: "/examples/file-upload", label: "File Upload" },
          { link: "/examples/infinite-scroll", label: "Infinite Scroll" },
          { link: "/examples/filtering", label: "Filtering" },
          ...(user?.role === "admin" ? [{ link: "/admin", label: "Admin" }] : []),
        ]
      : [
          { link: "/login", label: "Login" },
          { link: "/register", label: "Register" },
        ]),
  ]

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={`px-2 py-1 rounded-md transition-colors ${
        isLinkActive(link.link)
          ? "font-medium text-blue-600 dark:text-blue-400"
          : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      }`}
      onClick={closeDrawer}
    >
      {link.label}
    </Link>
  ))

  return (
    <header className="h-[60px] border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-200">
      <Container className="h-full flex items-center justify-between">
        <Logo />

        <Group spacing={5} className="hidden md:flex">
          {items}
        </Group>

        <Group>
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Button
                variant="subtle"
                color="red"
                size="sm"
                leftIcon={<LogOut size={16} />}
                onClick={logout}
                className="hidden md:flex"
              >
                Logout
              </Button>

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
                    className={`flex items-center ${userMenuOpened ? "bg-gray-100 dark:bg-gray-800" : ""} px-2 py-1 rounded-md`}
                  >
                    <Group spacing={7}>
                      <Avatar src={`https://i.pravatar.cc/150?u=${user?.id}`} alt={user?.name} radius="xl" size={20} />
                      <Text weight={500} size="sm" className="hidden md:block">
                        {user?.name}
                      </Text>
                      <ChevronDown size={12} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item icon={<User size={14} />}>Profile</Menu.Item>
                  <Menu.Item icon={<Settings size={14} />}>Settings</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item color="red" icon={<LogOut size={14} />} onClick={logout}>
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          ) : (
            <Button component={Link} href="/login" size="sm" className="hidden md:block">
              Sign in
            </Button>
          )}

          <Burger opened={drawerOpened} onClick={toggleDrawer} className="md:hidden" />
        </Group>
      </Container>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className="md:hidden"
        zIndex={1000000}
      >
        <div className="flex flex-col space-y-4">
          {items}
          {isAuthenticated && (
            <Button variant="subtle" color="red" leftIcon={<LogOut size={16} />} onClick={logout} className="mt-4">
              Logout
            </Button>
          )}
        </div>
      </Drawer>
    </header>
  )
}
