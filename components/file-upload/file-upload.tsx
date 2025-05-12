"use client"

import { useState, useRef } from "react"
import { Group, Text, Button, Progress, Box, ActionIcon } from "@mantine/core"
import { Dropzone, type FileWithPath } from "@mantine/dropzone"
import { Upload, X, File, Check } from "lucide-react"

export function FileUpload({
  onUpload,
  accept = ["image/*", "application/pdf"],
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  title = "Upload files",
  description = "Drag files here or click to select files",
}: {
  onUpload: (files: File[]) => Promise<void>
  accept?: string[]
  maxSize?: number
  maxFiles?: number
  title?: string
  description?: string
}) {
  const [files, setFiles] = useState<FileWithPath[]>([])
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const openRef = useRef<() => void>(null)

  const handleDrop = (droppedFiles: FileWithPath[]) => {
    // Limit the number of files
    const newFiles = [...files, ...droppedFiles].slice(0, maxFiles)
    setFiles(newFiles)
  }

  const handleRemove = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setProgress(0)
    setIsComplete(false)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    try {
      // Call the onUpload callback with the files
      await onUpload(files)

      // Complete the upload
      clearInterval(interval)
      setProgress(100)
      setIsComplete(true)

      // Reset after 2 seconds
      setTimeout(() => {
        setFiles([])
        setProgress(0)
        setIsComplete(false)
      }, 2000)
    } catch (error) {
      console.error("Upload failed:", error)
      clearInterval(interval)
    } finally {
      setIsUploading(false)
    }
  }

  const previews = files.map((file, index) => (
    <Box key={index} className="relative flex items-center p-2 mt-2 border rounded">
      <File size={24} className="mr-2" />
      <div className="flex-1 min-w-0">
        <Text size="sm" className="truncate">
          {file.name}
        </Text>
        <Text size="xs" color="dimmed">
          {(file.size / 1024).toFixed(2)} KB
        </Text>
      </div>
      <ActionIcon onClick={() => handleRemove(index)} disabled={isUploading}>
        <X size={18} />
      </ActionIcon>
    </Box>
  ))

  return (
    <div className="relative mb-8">
      <Dropzone
        openRef={openRef}
        onDrop={handleDrop}
        className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg pb-12"
        radius="md"
        accept={accept}
        maxSize={maxSize}
        disabled={isUploading || files.length >= maxFiles}
        multiple
      >
        <div style={{ pointerEvents: "none" }} className="flex flex-col items-center justify-center p-6">
          <Group position="center">
            <Dropzone.Accept>
              <Upload size={50} className="text-green-500" />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <X size={50} className="text-red-500" />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <Upload size={50} className="text-gray-400 dark:text-gray-600" />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            {title}
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            {description}
          </Text>
        </div>
      </Dropzone>

      {files.length > 0 && (
        <div className="mt-4">
          {previews}

          {isUploading && (
            <Progress
              value={progress}
              size="sm"
              mt="md"
              mb="xs"
              radius="xl"
              color={isComplete ? "green" : "blue"}
              animate
            />
          )}

          {isComplete && (
            <Group position="center" mt="md">
              <Check size={20} className="text-green-500" />
              <Text size="sm" color="green">
                Upload complete!
              </Text>
            </Group>
          )}
        </div>
      )}

      <Button
        className="absolute w-[250px] left-1/2 -translate-x-1/2 -bottom-5"
        size="md"
        radius="xl"
        onClick={handleUpload}
        disabled={files.length === 0 || isUploading}
        loading={isUploading}
      >
        {files.length > 0 ? `Upload ${files.length} file${files.length !== 1 ? "s" : ""}` : "Select files"}
      </Button>
    </div>
  )
}
