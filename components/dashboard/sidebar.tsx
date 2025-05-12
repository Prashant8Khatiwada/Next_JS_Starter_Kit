"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import {
  LayoutTemplate,
  Table2,
  Upload,
  Infinity,
  SlidersHorizontal,
  Layers,
  MenuIcon as Menu2,
  X,
  LogOutIcon as Logout,
  FormInput,
  BarChart3,
  Bell,
  ServerIcon,
  ShieldCheck,
} from "lucide-react"
import { Button, NavLink, Box, Title, Divider, ScrollArea } from "@mantine/core"

interface SidebarLink {
  href: string
  label: string
  icon: React.ReactNode
  adminOnly?: boolean
}

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const links: SidebarLink[] = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: <LayoutTemplate size={20} />,
    },
    {
      href: "/examples/reusable-table",
      label: "Table Example",
      icon: <Table2 size={20} />,
    },
    {
      href: "/examples/file-upload",
      label: "File Upload",
      icon: <Upload size={20} />,
    },
    {
      href: "/examples/infinite-scroll",
      label: "Infinite Scroll",
      icon: <Infinity size={20} />,
    },
    {
      href: "/examples/filtering",
      label: "Filtering",
      icon: <SlidersHorizontal size={20} />,
    },
    {
      href: "/examples/form-validation",
      label: "Form Validation",
      icon: <FormInput size={20} />,
    },
    {
      href: "/examples/data-visualization",
      label: "Data Visualization",
      icon: <BarChart3 size={20} />,
    },
    {
      href: "/examples/notifications",
      label: "Notifications",
      icon: <Bell size={20} />,
    },
    {
      href: "/examples/api-integration",
      label: "API Integration",
      icon: <ServerIcon size={20} />,
    },
    {
      href: "/examples/auth-flows",
      label: "Auth Flows",
      icon: <ShieldCheck size={20} />,
    },
    {
      href: "/examples/components",
      label: "Components",
      icon: <Layers size={20} />,
    },
  ]

  const filteredLinks = links.filter((link) => !link.adminOnly || user?.role === "admin")

  return (
    <Box
      className={`${
        collapsed ? "w-[70px]" : "w-[250px]"
      } h-screen fixed left-0 top-0 z-30 transition-all duration-300 ease-in-out`}
      style={{
        borderRight: "1px solid var(--mantine-color-gray-3)",
        backgroundColor: "var(--mantine-color-body)",
      }}
    >
      <Box className="flex flex-col h-full">
        <Box
          className="h-[60px] flex items-center justify-between px-4"
          style={{
            borderBottom: "1px solid var(--mantine-color-gray-3)",
          }}
        >
          {!collapsed && (
            <Link href="/dashboard" className="font-bold text-xl">
              <Title order={4} c="blue">
                NextKit
              </Title>
            </Link>
          )}
          <Button
            variant="subtle"
            size="sm"
            p={0}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu2 size={20} /> : <X size={20} />}
          </Button>
        </Box>

        <ScrollArea className="flex-1 py-4">
          {filteredLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <NavLink
                key={link.href}
                component={Link}
                href={link.href}
                label={!collapsed && link.label}
                leftSection={link.icon}
                active={isActive}
                variant={isActive ? "filled" : "subtle"}
                className={`mx-2 ${collapsed ? "justify-center px-0" : ""}`}
              />
            )
          })}
        </ScrollArea>

        <Divider my="sm" />

        <Box p="md">
          <Button
            leftSection={<Logout size={18} />}
            variant="subtle"
            color="red"
            onClick={logout}
            fullWidth={!collapsed}
            className={collapsed ? "justify-center px-0" : ""}
          >
            {!collapsed && "Logout"}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
