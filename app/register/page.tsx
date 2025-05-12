"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Anchor } from "@mantine/core"
import { useAuth } from "@/context/auth-context"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { register, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await register(name, email, password)
      // Redirect is handled in the auth context
    } catch (error) {
      setError("Registration failed. Please try again.")
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" className="font-extrabold">
        Create an account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component={Link} href="/login">
          Sign in
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
            label="Name"
            placeholder="Your name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            mt="md"
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
          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
