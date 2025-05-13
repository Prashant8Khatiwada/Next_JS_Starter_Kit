"use client";

import { AuthGuard } from "@/src/components/auth-guard";
import { DashboardLayout } from "@/src/components/dashboard/layout";
import {
  Title,
  Paper,
  Text,
  Tabs,
  Button,
  TextInput,
  PasswordInput,
  Checkbox,
  Group,
  Divider,
  Alert,
  Code,
  Accordion,
  Stack,
} from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { useAuth } from "@/src/context/auth-context";
import {
  AlertCircle,
  Check,
  Github,
  ChromeIcon as Google,
  Key,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";

export default function AuthFlowsPage() {
  const { login, register, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<
    "login" | "register" | "reset" | "2fa" | "success"
  >("login");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
    },
  });

  const registerForm = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    validate: {
      name: (value) =>
        value.length >= 2 ? null : "Name must be at least 2 characters",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
      terms: (value) =>
        value ? null : "You must accept the terms and conditions",
    },
  });

  const resetForm = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const twoFactorForm = useForm({
    initialValues: {
      code: "",
    },
    validate: {
      code: (value) => (/^\d{6}$/.test(value) ? null : "Code must be 6 digits"),
    },
  });

  const handleLogin = (values: typeof loginForm.values) => {
    setError(null);
    setSuccess(null);

    // In a real app, you would call your authentication service
    try {
      login(values.email, values.password)
        .then(() => {
          setSuccess("Login successful!");
          setAuthMode("success");
        })
        .catch((err) => {
          setError(err.message || "Invalid email or password");
        });
    } catch (err) {
      setError("An error occurred during login");
    }
  };

  const handleRegister = (values: typeof registerForm.values) => {
    setError(null);
    setSuccess(null);

    // In a real app, you would call your authentication service
    try {
      register(values.name, values.email, values.password)
        .then(() => {
          setSuccess("Registration successful!");
          setAuthMode("success");
        })
        .catch((err) => {
          setError(err.message || "Registration failed");
        });
    } catch (err) {
      setError("An error occurred during registration");
    }
  };

  const handleResetPassword = (values: typeof resetForm.values) => {
    setError(null);
    setSuccess(
      "If an account exists with this email, you will receive a password reset link."
    );
    // In a real app, you would call your password reset service
  };

  const handleTwoFactorAuth = (values: typeof twoFactorForm.values) => {
    setError(null);
    setSuccess("Two-factor authentication successful!");
    setAuthMode("success");
    // In a real app, you would verify the 2FA code
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <Title order={2} mb="lg">
          Authentication Flows Example
        </Title>

        <Paper withBorder p="md" radius="md" mb="xl">
          <Text>
            This example demonstrates various authentication flows including
            login, registration, password reset, and two-factor authentication.
          </Text>
        </Paper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Paper withBorder p="xl" radius="md">
              <Title order={3} mb="md">
                Authentication Demo
              </Title>

              <Tabs
                value={authMode}
                onChange={(value) => setAuthMode(value as any)}
              >
                <Tabs.List mb="md">
                  <Tabs.Tab value="login" leftSection={<User size={16} />}>
                    Login
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="register"
                    leftSection={<UserPlus size={16} />}
                  >
                    Register
                  </Tabs.Tab>
                  <Tabs.Tab value="reset" leftSection={<Key size={16} />}>
                    Reset Password
                  </Tabs.Tab>
                  <Tabs.Tab value="2fa" leftSection={<ShieldCheck size={16} />}>
                    Two-Factor
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="login">
                  <form onSubmit={loginForm.onSubmit(handleLogin)}>
                    <TextInput
                      label="Email"
                      placeholder="your@email.com"
                      leftSection={<Mail size={16} />}
                      mb="md"
                      {...loginForm.getInputProps("email")}
                    />

                    <PasswordInput
                      label="Password"
                      placeholder="Your password"
                      leftSection={<Lock size={16} />}
                      mb="md"
                      {...loginForm.getInputProps("password")}
                    />

                    <Group position="apart" mb="md">
                      <Checkbox
                        label="Remember me"
                        {...loginForm.getInputProps("rememberMe", {
                          type: "checkbox",
                        })}
                      />
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={() => setAuthMode("reset")}
                        className="underline"
                      >
                        Forgot password?
                      </Button>
                    </Group>

                    <Button type="submit" fullWidth loading={isLoading}>
                      Sign in
                    </Button>

                    <Divider
                      label="Or continue with"
                      labelPosition="center"
                      my="lg"
                    />

                    <Group grow mb="md">
                      <Button
                        leftSection={<Google size={16} />}
                        variant="outline"
                      >
                        Google
                      </Button>
                      <Button
                        leftSection={<Github size={16} />}
                        variant="outline"
                      >
                        GitHub
                      </Button>
                    </Group>

                    <Text ta="center" size="sm">
                      Don't have an account?{" "}
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={() => setAuthMode("register")}
                        className="underline"
                      >
                        Register
                      </Button>
                    </Text>
                  </form>
                </Tabs.Panel>

                <Tabs.Panel value="register">
                  <form onSubmit={registerForm.onSubmit(handleRegister)}>
                    <TextInput
                      label="Name"
                      placeholder="John Doe"
                      leftSection={<User size={16} />}
                      mb="md"
                      {...registerForm.getInputProps("name")}
                    />

                    <TextInput
                      label="Email"
                      placeholder="your@email.com"
                      leftSection={<Mail size={16} />}
                      mb="md"
                      {...registerForm.getInputProps("email")}
                    />

                    <PasswordInput
                      label="Password"
                      placeholder="Your password"
                      leftSection={<Lock size={16} />}
                      mb="md"
                      {...registerForm.getInputProps("password")}
                    />

                    <PasswordInput
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      leftSection={<Lock size={16} />}
                      mb="md"
                      {...registerForm.getInputProps("confirmPassword")}
                    />

                    <Checkbox
                      label="I agree to the terms and conditions"
                      mb="md"
                      {...registerForm.getInputProps("terms", {
                        type: "checkbox",
                      })}
                    />

                    <Button type="submit" fullWidth loading={isLoading}>
                      Register
                    </Button>

                    <Divider
                      label="Or continue with"
                      labelPosition="center"
                      my="lg"
                    />

                    <Group grow mb="md">
                      <Button
                        leftSection={<Google size={16} />}
                        variant="outline"
                      >
                        Google
                      </Button>
                      <Button
                        leftSection={<Github size={16} />}
                        variant="outline"
                      >
                        GitHub
                      </Button>
                    </Group>

                    <Text ta="center" size="sm">
                      Already have an account?{" "}
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={() => setAuthMode("login")}
                        className="underline"
                      >
                        Login
                      </Button>
                    </Text>
                  </form>
                </Tabs.Panel>

                <Tabs.Panel value="reset">
                  <form onSubmit={resetForm.onSubmit(handleResetPassword)}>
                    <Text mb="md">
                      Enter your email address and we'll send you a link to
                      reset your password.
                    </Text>

                    <TextInput
                      label="Email"
                      placeholder="your@email.com"
                      leftSection={<Mail size={16} />}
                      mb="md"
                      {...resetForm.getInputProps("email")}
                    />

                    <Button type="submit" fullWidth loading={isLoading}>
                      Send Reset Link
                    </Button>

                    <Text ta="center" size="sm" mt="md">
                      Remember your password?{" "}
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={() => setAuthMode("login")}
                        className="underline"
                      >
                        Back to login
                      </Button>
                    </Text>
                  </form>
                </Tabs.Panel>

                <Tabs.Panel value="2fa">
                  <form onSubmit={twoFactorForm.onSubmit(handleTwoFactorAuth)}>
                    <Text mb="md">
                      Enter the 6-digit code from your authenticator app to
                      verify your identity.
                    </Text>

                    <TextInput
                      label="Authentication Code"
                      placeholder="123456"
                      leftSection={<ShieldCheck size={16} />}
                      mb="md"
                      {...twoFactorForm.getInputProps("code")}
                    />

                    <Button type="submit" fullWidth loading={isLoading}>
                      Verify
                    </Button>
                  </form>
                </Tabs.Panel>

                <Tabs.Panel value="success">
                  <Alert
                    icon={<Check size={16} />}
                    title="Success"
                    color="green"
                  >
                    {success || "Authentication successful!"}
                  </Alert>

                  <Button
                    fullWidth
                    mt="md"
                    onClick={() => setAuthMode("login")}
                  >
                    Back to Login
                  </Button>
                </Tabs.Panel>
              </Tabs>

              {error && (
                <Alert
                  icon={<AlertCircle size={16} />}
                  title="Error"
                  color="red"
                  mt="md"
                >
                  {error}
                </Alert>
              )}

              {success && authMode !== "success" && (
                <Alert
                  icon={<Check size={16} />}
                  title="Success"
                  color="green"
                  mt="md"
                >
                  {success}
                </Alert>
              )}
            </Paper>
          </div>

          <div>
            <Paper withBorder p="xl" radius="md">
              <Title order={3} mb="md">
                Authentication Patterns
              </Title>

              <Accordion>
                <Accordion.Item value="jwt">
                  <Accordion.Control>JWT Authentication</Accordion.Control>
                  <Accordion.Panel>
                    <Text mb="md">
                      JSON Web Tokens (JWT) are a popular method for
                      implementing authentication in modern web applications.
                      Here's how to implement JWT authentication in Next.js:
                    </Text>

                    <Code block>
                      {`// lib/auth.ts
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-key'
);

export async function signToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

// Example login API route
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Validate credentials (in a real app, check against database)
  if (email === 'user@example.com' && password === 'password') {
    const token = await signToken({ 
      id: '1', 
      email, 
      role: 'user' 
    });
    
    // Set HTTP-only cookie
    const response = NextResponse.json({ 
      success: true, 
      user: { id: '1', email, role: 'user' } 
    });
    
    response.cookies.set('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    return response;
  }
  
  return NextResponse.json(
    { success: false, message: 'Invalid credentials' },
    { status: 401 }
  );
}`}
                    </Code>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="oauth">
                  <Accordion.Control>OAuth / Social Login</Accordion.Control>
                  <Accordion.Panel>
                    <Text mb="md">
                      OAuth allows users to log in using their existing accounts
                      from services like Google, GitHub, or Facebook. Here's how
                      to implement OAuth using NextAuth.js:
                    </Text>

                    <Code block>
                      {`// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add your own logic here to validate credentials
        if (credentials?.email === 'user@example.com' && 
            credentials?.password === 'password') {
          return { 
            id: '1', 
            name: 'John Doe', 
            email: 'user@example.com',
            role: 'user'
          };
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
});

export { GET };`}
                    </Code>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="2fa">
                  <Accordion.Control>
                    Two-Factor Authentication
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text mb="md">
                      Two-factor authentication adds an extra layer of security
                      by requiring a second form of verification. Here's how to
                      implement 2FA using TOTP (Time-based One-Time Password):
                    </Text>

                    <Code block>
                      {`// lib/2fa.ts
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

// Generate a secret for a user
export function generateSecret(username: string) {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(username, 'YourApp', secret);
  
  return { secret, otpauth };
}

// Generate a QR code for the user to scan
export async function generateQRCode(otpauth: string) {
  return QRCode.toDataURL(otpauth);
}

// Verify a token
export function verifyToken(token: string, secret: string) {
  return authenticator.verify({ token, secret });
}

// Example API route to enable 2FA
// app/api/auth/enable-2fa/route.ts
import { NextResponse } from 'next/server';
import { generateSecret, generateQRCode } from '@/lib/2fa';

export async function POST(request: Request) {
  // In a real app, get the user from the session
  const user = { id: '1', email: 'user@example.com' };
  
  // Generate a secret for the user
  const { secret, otpauth } = generateSecret(user.email);
  
  // Generate a QR code
  const qrCode = await generateQRCode(otpauth);
  
  // In a real app, store the secret in the database
  // await db.user.update({ where: { id: user.id }, data: { twoFactorSecret: secret } });
  
  return NextResponse.json({ 
    success: true, 
    qrCode,
    secret, // In a real app, don't send the secret to the client
  });
}

// Example API route to verify 2FA
// app/api/auth/verify-2fa/route.ts
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/2fa';

export async function POST(request: Request) {
  const { token } = await request.json();
  
  // In a real app, get the user and their secret from the database
  const user = { 
    id: '1', 
    email: 'user@example.com',
    twoFactorSecret: 'USER_SECRET_FROM_DB' 
  };
  
  const isValid = verifyToken(token, user.twoFactorSecret);
  
  if (isValid) {
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json(
    { success: false, message: 'Invalid token' },
    { status: 401 }
  );
}`}
                    </Code>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="passwordless">
                  <Accordion.Control>
                    Passwordless Authentication
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text mb="md">
                      Passwordless authentication allows users to log in without
                      a password, typically using a one-time link sent to their
                      email or a code sent to their phone.
                    </Text>

                    <Code block>
                      {`// Example API route to send a magic link
// app/api/auth/passwordless/route.ts
import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  const { email } = await request.json();
  
  // In a real app, check if the user exists
  // const user = await db.user.findUnique({ where: { email } });
  // if (!user) return NextResponse.json({ success: true }); // Don't reveal if user exists
  
  // Generate a token that expires in 10 minutes
  const token = await signToken({ 
    email, 
    purpose: 'magic-link',
    exp: Math.floor(Date.now() / 1000) + 10 * 60 // 10 minutes
  });
  
  // Create the magic link
  const magicLink = \`\${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=\${token}\`;
  
  // Send the email
  await sendEmail({
    to: email,
    subject: 'Your Magic Link',
    html: \`
      <p>Click the link below to sign in:</p>
      <a href="\${magicLink}">Sign In</a>
      <p>This link will expire in 10 minutes.</p>
    \`,
  });
  
  return NextResponse.json({ success: true });
}

// Example API route to verify a magic link
// app/api/auth/verify/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { verifyToken, signToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login?error=invalid-token', request.url));
  }
  
  const payload = await verifyToken(token);
  
  if (!payload || payload.purpose !== 'magic-link') {
    return NextResponse.redirect(new URL('/login?error=invalid-token', request.url));
  }
  
  // In a real app, get the user from the database
  // const user = await db.user.findUnique({ where: { email: payload.email } });
  // if (!user) return NextResponse.redirect(new URL('/login?error=user-not-found', request.url));
  
  // Create a session token
  const sessionToken = await signToken({ 
    id: '1', // user.id in a real app
    email: payload.email,
    role: 'user'
  });
  
  // Set the session cookie
  const response = NextResponse.redirect(new URL('/', request.url));
  
  response.cookies.set('token', sessionToken, { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
  
  return response;
}`}
                    </Code>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="rbac">
                  <Accordion.Control>
                    Role-Based Access Control
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text mb="md">
                      Role-Based Access Control (RBAC) restricts access to
                      resources based on the user's role. Here's how to
                      implement RBAC in Next.js:
                    </Text>

                    <Code block>
                      {`// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Define routes that require authentication
const protectedRoutes = ['/dashboard', '/admin', '/profile'];
const adminRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;
  
  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    path === route || path.startsWith(\`\${route}/\`)
  );
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  // If no token, redirect to login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }
  
  // Verify the token
  const payload = await verifyToken(token);
  
  if (!payload) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }
  
  // Check if the route requires admin role
  const isAdminRoute = adminRoutes.some(route => 
    path === route || path.startsWith(\`\${route}/\`)
  );
  
  if (isAdminRoute && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};

// components/auth-guard.tsx
'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Loader } from '@mantine/core';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (requiredRole && user?.role !== requiredRole) {
        router.push('/unauthorized');
      } else {
        setIsChecking(false);
      }
    }
  }, [isLoading, isAuthenticated, user, router, requiredRole]);

  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="xl" />
      </div>
    );
  }

  return <>{children}</>;
}`}
                    </Code>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Paper>

            <Paper withBorder p="xl" radius="md" mt="lg">
              <Title order={3} mb="md">
                Security Best Practices
              </Title>

              <Stack spacing="md">
                <Alert
                  icon={<ShieldCheck size={16} />}
                  title="Use HTTPS"
                  color="blue"
                >
                  Always use HTTPS in production to encrypt data in transit.
                </Alert>

                <Alert
                  icon={<ShieldCheck size={16} />}
                  title="HTTP-Only Cookies"
                  color="blue"
                >
                  Store authentication tokens in HTTP-only cookies to prevent
                  access from JavaScript.
                </Alert>

                <Alert
                  icon={<ShieldCheck size={16} />}
                  title="CSRF Protection"
                  color="blue"
                >
                  Implement CSRF tokens for form submissions to prevent
                  cross-site request forgery attacks.
                </Alert>

                <Alert
                  icon={<ShieldCheck size={16} />}
                  title="Rate Limiting"
                  color="blue"
                >
                  Implement rate limiting for authentication endpoints to
                  prevent brute force attacks.
                </Alert>

                <Alert
                  icon={<ShieldCheck size={16} />}
                  title="Password Hashing"
                  color="blue"
                >
                  Always hash passwords using a strong algorithm like bcrypt or
                  Argon2.
                </Alert>
              </Stack>
            </Paper>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
