"use client";

import { useState } from "react";
import { Table, ActionIcon, Group, Text, Badge, Loader } from "@mantine/core";
import { useTasks } from "../hooks/use-tasks";
import { Pencil, Trash } from "lucide-react";

export function TaskList() {
  const { tasks, isLoading, deleteTask, error } = useTasks();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <Text c="red">Error loading tasks: {error.message}</Text>;
  }

  if (!tasks || tasks.length === 0) {
    return <Text>No tasks found. Add your first task!</Text>;
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteTask(id);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>{task.title}</td>
            <td>
              <Badge color={task.completed ? "green" : "yellow"}>
                {task.completed ? "Completed" : "Pending"}
              </Badge>
            </td>
            <td>
              <Badge
                color={
                  task.priority === "high"
                    ? "red"
                    : task.priority === "medium"
                    ? "orange"
                    : "blue"
                }
              >
                {task.priority}
              </Badge>
            </td>
            <td>
              <Group gap={0} justify="flex-start">
                <ActionIcon>
                  <Pencil size={16} />
                </ActionIcon>
                <ActionIcon
                  color="red"
                  onClick={() => handleDelete(task.id)}
                  loading={isDeleting === task.id}
                >
                  <Trash size={16} />
                </ActionIcon>
              </Group>
            </td>
          </tr>
        ))}{" "}
      </tbody>
    </Table>
  );
}
