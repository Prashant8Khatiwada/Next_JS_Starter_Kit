"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Group, Anchor } from "@mantine/core"
import { useAuth } from "@/context/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login(email, password)
      // Redirect is handled in the auth context
    } catch (error) {
      setError("Invalid email or password")
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" className="font-extrabold">
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don't have an account yet?{" "}
        <Anchor size="sm" component={Link} href="/register">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && (
          <Text c="red" size="sm" mb={10}>
            {error}
          </Text>
        )}

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Group position="apart" mt="lg">
            <Anchor component={Link} href="/forgot-password" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Sign in
          </Button>
        </form>

        <Text size="xs" ta="center" mt={20}>
          Demo credentials:
          <br />
          User: user@example.com / password
          <br />
          Admin: admin@example.com / password
        </Text>
      </Paper>
    </Container>
  )
}
