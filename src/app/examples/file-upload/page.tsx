"use client";

import { AuthGuard } from "@/src/components/auth-guard";
import { Title, Paper, Text } from "@mantine/core";
import { FileUpload } from "@/src/components/file-upload/file-upload";
import { DashboardLayout } from "@/src/components/dashboard/layout";

export default function FileUploadPage() {
  const handleUpload = async (files: File[]) => {
    // In a real app, you would use FormData to upload files
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    // Example of how you would upload files
    console.log("Uploading files:", files);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, you would make an API call like this:
    // await api.upload('/api/upload', formData)

    console.log("Upload complete");
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <Title order={2} mb="lg">
          File Upload Example
        </Title>

        <Paper withBorder p="md" radius="md" mb="xl">
          <Text>
            This example demonstrates how to handle file uploads, including
            multipart/form-data.
          </Text>

          <FileUpload
            onUpload={handleUpload}
            title="Upload files"
            description="Drag and drop files here or click to select files"
            accept={["image/*", "application/pdf", ".docx"]}
            maxSize={5 * 1024 * 1024} // 5MB
            maxFiles={5}
          />
        </Paper>
      </DashboardLayout>
    </AuthGuard>
  );
}
