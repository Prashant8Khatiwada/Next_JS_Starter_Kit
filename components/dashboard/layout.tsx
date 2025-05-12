"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "./sidebar"
import { DashboardHeader } from "./header"
import { AuthGuard } from "@/components/auth-guard"
import { Box, LoadingOverlay } from "@mantine/core"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(250)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setSidebarWidth(window.innerWidth < 768 ? 70 : 250)
    }

    // Initial check
    checkMobile()

    // Add event listener
    window.addEventListener("resize", checkMobile)

    // Hide loading overlay after a short delay to ensure components are mounted
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobile)
      clearTimeout(timer)
    }
  }, [])

  return (
    <AuthGuard>
      <Box className="min-h-screen relative" style={{ backgroundColor: "var(--mantine-color-gray-0)" }}>
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
        <DashboardSidebar />
        <DashboardHeader sidebarWidth={sidebarWidth} />
        <Box
          component="main"
          className="pt-[60px] transition-all duration-300"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          <Box p="md">{children}</Box>
        </Box>
      </Box>
    </AuthGuard>
  )
}
