"use client";
import type React from "react";

import { useState } from "react";
import { TextInput, Button, Select, Checkbox, Stack } from "@mantine/core";
import { useTasks } from "../hooks/use-tasks";

export function TaskForm() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<string | null>("medium");
  const [completed, setCompleted] = useState(false);
  const { addTask, isLoading } = useTasks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !priority) return;

    await addTask({
      title,
      priority: priority as "low" | "medium" | "high",
      completed,
    });

    // Reset form
    setTitle("");
    setPriority("medium");
    setCompleted(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Task Title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Select
          label="Priority"
          placeholder="Select priority"
          value={priority}
          onChange={setPriority}
          data={[
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
          required
        />

        <Checkbox
          label="Mark as completed"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />

        <Button type="submit" loading={isLoading}>
          Add Task
        </Button>
      </Stack>
    </form>
  );
}
