import type React from "react"
import Client from "./client"

export const metadata = {
  title: "Next.js Starter Kit",
  description: "Feature-centric Next.js starter with Mantine, Tailwind, TanStack Query, and Context API",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <Client>{children}</Client>
}


import './globals.css'