"use client";

import { AuthGuard } from "@/src/components/auth-guard";
import { DashboardLayout } from "@/src/components/dashboard/layout";
import {
  Title,
  Paper,
  Text,
  Grid,
  Select,
  Group,
  SegmentedControl,
  Button,
  Card,
  RingProgress,
  Divider,
} from "@mantine/core";
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { RefreshCw } from "lucide-react";

// Sample data for charts
const monthlyData = [
  { name: "Jan", value: 1000, users: 400, sessions: 600 },
  { name: "Feb", value: 1500, users: 500, sessions: 700 },
  { name: "Mar", value: 1200, users: 600, sessions: 800 },
  { name: "Apr", value: 1800, users: 700, sessions: 1000 },
  { name: "May", value: 2000, users: 800, sessions: 1200 },
  { name: "Jun", value: 2400, users: 1000, sessions: 1500 },
  { name: "Jul", value: 2200, users: 1100, sessions: 1400 },
  { name: "Aug", value: 2600, users: 1200, sessions: 1600 },
  { name: "Sep", value: 3000, users: 1300, sessions: 1800 },
  { name: "Oct", value: 2800, users: 1400, sessions: 1700 },
  { name: "Nov", value: 3200, users: 1500, sessions: 1900 },
  { name: "Dec", value: 3600, users: 1600, sessions: 2000 },
];

const weeklyData = [
  { name: "Mon", value: 500, users: 200, sessions: 300 },
  { name: "Tue", value: 600, users: 250, sessions: 350 },
  { name: "Wed", value: 700, users: 300, sessions: 400 },
  { name: "Thu", value: 800, users: 350, sessions: 450 },
  { name: "Fri", value: 900, users: 400, sessions: 500 },
  { name: "Sat", value: 700, users: 300, sessions: 400 },
  { name: "Sun", value: 500, users: 200, sessions: 300 },
];

const pieData = [
  { name: "Desktop", value: 45 },
  { name: "Mobile", value: 35 },
  { name: "Tablet", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function DataVisualizationPage() {
  const [timeRange, setTimeRange] = useState("monthly");
  const [chartType, setChartType] = useState("line");
  const [dataKey, setDataKey] = useState("value");

  const data = timeRange === "monthly" ? monthlyData : weeklyData;

  // Function to generate random data for refresh demo
  const refreshData = () => {
    // In a real app, you would fetch new data from an API
    console.log("Refreshing data...");
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <Title order={2} mb="lg">
          Data Visualization Example
        </Title>

        <Paper withBorder p="md" radius="md" mb="xl">
          <Text>
            This example demonstrates various data visualization techniques
            using Recharts. You can switch between different chart types and
            data ranges.
          </Text>
        </Paper>

        <Paper withBorder p="md" radius="md" mb="xl">
          <Group position="apart">
            <Group>
              <SegmentedControl
                value={timeRange}
                onChange={setTimeRange}
                data={[
                  { label: "Weekly", value: "weekly" },
                  { label: "Monthly", value: "monthly" },
                ]}
              />

              <SegmentedControl
                value={chartType}
                onChange={setChartType}
                data={[
                  { label: "Line", value: "line" },
                  { label: "Bar", value: "bar" },
                  { label: "Area", value: "area" },
                ]}
              />

              <Select
                value={dataKey}
                onChange={(value) => setDataKey(value || "value")}
                data={[
                  { label: "Revenue", value: "value" },
                  { label: "Users", value: "users" },
                  { label: "Sessions", value: "sessions" },
                ]}
                style={{ width: 130 }}
              />
            </Group>

            <Button
              leftSection={<RefreshCw size={16} />}
              variant="light"
              onClick={refreshData}
            >
              Refresh
            </Button>
          </Group>
        </Paper>

        <Grid>
          <Grid.Col span={12} md={8}>
            <Paper withBorder p="md" radius="md" style={{ height: 400 }}>
              <Title order={4} mb="md">
                {timeRange === "monthly" ? "Monthly" : "Weekly"}{" "}
                {dataKey === "value"
                  ? "Revenue"
                  : dataKey === "users"
                  ? "Users"
                  : "Sessions"}
              </Title>

              <ResponsiveContainer width="100%" height="85%">
                {chartType === "line" ? (
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={dataKey}
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                ) : chartType === "bar" ? (
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={dataKey} fill="#8884d8" />
                  </BarChart>
                ) : (
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey={dataKey}
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12} md={4}>
            <Paper withBorder p="md" radius="md" style={{ height: 400 }}>
              <Title order={4} mb="md">
                Device Distribution
              </Title>

              <ResponsiveContainer width="100%" height="60%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <Divider my="md" />

              <Group position="apart">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <Text size="sm">
                      {entry.name}: {entry.value}%
                    </Text>
                  </div>
                ))}
              </Group>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Grid>
              <Grid.Col span={4}>
                <Card withBorder p="xl" radius="md">
                  <Group position="apart">
                    <div>
                      <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                        Revenue
                      </Text>
                      <Text fw={700} size="xl">
                        $12,750
                      </Text>
                      <Text c="green" size="sm">
                        +18% from last month
                      </Text>
                    </div>
                    <RingProgress
                      size={80}
                      roundCaps
                      thickness={8}
                      sections={[{ value: 72, color: "blue" }]}
                      label={
                        <Text fw={700} ta="center" size="lg">
                          72%
                        </Text>
                      }
                    />
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={4}>
                <Card withBorder p="xl" radius="md">
                  <Group position="apart">
                    <div>
                      <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                        Users
                      </Text>
                      <Text fw={700} size="xl">
                        1,567
                      </Text>
                      <Text c="green" size="sm">
                        +24% from last month
                      </Text>
                    </div>
                    <RingProgress
                      size={80}
                      roundCaps
                      thickness={8}
                      sections={[{ value: 84, color: "green" }]}
                      label={
                        <Text fw={700} ta="center" size="lg">
                          84%
                        </Text>
                      }
                    />
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={4}>
                <Card withBorder p="xl" radius="md">
                  <Group position="apart">
                    <div>
                      <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                        Conversion
                      </Text>
                      <Text fw={700} size="xl">
                        3.2%
                      </Text>
                      <Text c="red" size="sm">
                        -2% from last month
                      </Text>
                    </div>
                    <RingProgress
                      size={80}
                      roundCaps
                      thickness={8}
                      sections={[{ value: 48, color: "orange" }]}
                      label={
                        <Text fw={700} ta="center" size="lg">
                          48%
                        </Text>
                      }
                    />
                  </Group>
                </Card>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </DashboardLayout>
    </AuthGuard>
  );
}
