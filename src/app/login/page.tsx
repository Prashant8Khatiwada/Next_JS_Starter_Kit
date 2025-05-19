"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import {
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Anchor,
} from "@mantine/core";
import { useAuth } from "@/src/context/auth-context";
import { InputField } from "@/src/components/ui/input";
import { ActivityIcon, UsersIcon } from "lucide-react";
import { Checkbox } from "@/src/components/ui/checkbox";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const [checked, setChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      // Redirect is handled in the auth context
    } catch (error) {
      setError("Invalid email or password");
    }
  };

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
          <InputField
            label="Email"
            type="email"
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

          <Group justify="apart" mt="lg">
            <Anchor component={Link} href="/forgot-password" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          {/* <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Sign in
          </Button> */}
        </form>
        <label className="flex items-center space-x-2 cursor-pointer">
          <Checkbox
            checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)}
          />
          <span>Accept Terms and Conditions</span>
        </label>

        <Text size="xs" ta="center" mt={20}>
          Demo credentials:
          <br />
          User: user@example.com / password
          <br />
          Admin: admin@example.com / password
        </Text>
      </Paper>
    </Container>
  );
}
