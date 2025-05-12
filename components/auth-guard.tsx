"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader } from "@mantine/core"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "user" | "admin"
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Store the intended destination to redirect after login
        sessionStorage.setItem("redirectAfterLogin", pathname)
        router.push("/login")
      } else if (requiredRole && user?.role !== requiredRole) {
        // User doesn't have the required role
        router.push("/unauthorized")
      } else {
        setIsChecking(false)
      }
    }
  }, [isLoading, isAuthenticated, user, router, pathname, requiredRole])

  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="xl" />
      </div>
    )
  }

  return <>{children}</>
}
