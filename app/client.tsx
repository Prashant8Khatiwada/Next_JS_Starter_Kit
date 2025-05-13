"use client";
import type React from "react";
import "@mantine/core/styles.css";
import "./globals.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { QueryProvider } from "@/lib/query-provider";
import { ThemeProvider, useTheme } from "@/context/theme-context";
import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/context/auth-context";

function MantineWrapper({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useTheme();

  return <MantineProvider>{children}</MantineProvider>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              <MantineWrapper>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">{children}</main>
                </div>
              </MantineWrapper>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
