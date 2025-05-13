"use client";

import { AuthGuard } from "@/src/components/auth-guard";
import { Title, Paper, Text } from "@mantine/core";
import { ProductsTable } from "@/src/examples/reusable-table/products-table";
import { DashboardLayout } from "@/src/components/dashboard/layout";

export default function ReusableTablePage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <Title order={2} mb="lg">
          Reusable Table Example
        </Title>

        <Paper withBorder p="md" radius="md" mb="xl">
          <Text>
            This example demonstrates a reusable table component that can handle
            different data types and filters. It supports CRUD operations,
            custom actions, bulk actions, and pagination.
          </Text>
        </Paper>

        <ProductsTable />
      </DashboardLayout>
    </AuthGuard>
  );
}
