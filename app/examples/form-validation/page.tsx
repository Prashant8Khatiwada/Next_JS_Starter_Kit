"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard/layout"
import {
  Title,
  Paper,
  Text,
  TextInput,
  PasswordInput,
  NumberInput,
  Checkbox,
  Button,
  Group,
  Select,
  Textarea,
  Divider,
  Stack,
  Alert,
} from "@mantine/core"
import { useForm, isEmail, isNotEmpty, hasLength, matches, isInRange } from "@mantine/form"
import { useState } from "react"
import { Check } from "lucide-react"

export default function FormValidationPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<any>(null)

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      age: 18,
      website: "",
      bio: "",
      occupation: "",
      terms: false,
    },
    validate: {
      name: hasLength({ min: 2, max: 50 }, "Name must be between 2 and 50 characters"),
      email: isEmail("Invalid email address"),
      password: hasLength({ min: 8 }, "Password must be at least 8 characters"),
      confirmPassword: (value, values) => (value !== values.password ? "Passwords do not match" : null),
      age: isInRange({ min: 18, max: 100 }, "Age must be between 18 and 100"),
      website: matches(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, "Enter a valid URL"),
      bio: hasLength({ max: 300 }, "Bio must be less than 300 characters"),
      occupation: isNotEmpty("Please select an occupation"),
      terms: (value) => (value === false ? "You must accept the terms and conditions" : null),
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    // In a real app, you would submit the form data to an API
    console.log("Form submitted:", values)
    setFormData(values)
    setSubmitted(true)
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <Title order={2} mb="lg">
          Form Validation Example
        </Title>

        <Paper withBorder p="md" radius="md" mb="xl">
          <Text>
            This example demonstrates form validation using Mantine's form library. It includes various validation rules
            and error handling.
          </Text>
        </Paper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Paper withBorder p="xl" radius="md">
            <Title order={3} mb="md">
              Registration Form
            </Title>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack spacing="md">
                <TextInput label="Full Name" placeholder="John Doe" withAsterisk {...form.getInputProps("name")} />

                <TextInput label="Email" placeholder="your@email.com" withAsterisk {...form.getInputProps("email")} />

                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  withAsterisk
                  {...form.getInputProps("password")}
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  withAsterisk
                  {...form.getInputProps("confirmPassword")}
                />

                <NumberInput
                  label="Age"
                  placeholder="Your age"
                  withAsterisk
                  min={0}
                  max={120}
                  {...form.getInputProps("age")}
                />

                <TextInput label="Website" placeholder="https://yourwebsite.com" {...form.getInputProps("website")} />

                <Select
                  label="Occupation"
                  placeholder="Select your occupation"
                  withAsterisk
                  data={[
                    { value: "developer", label: "Developer" },
                    { value: "designer", label: "Designer" },
                    { value: "manager", label: "Manager" },
                    { value: "student", label: "Student" },
                    { value: "other", label: "Other" },
                  ]}
                  {...form.getInputProps("occupation")}
                />

                <Textarea label="Bio" placeholder="Tell us about yourself" minRows={3} {...form.getInputProps("bio")} />

                <Checkbox
                  label="I agree to the terms and conditions"
                  {...form.getInputProps("terms", { type: "checkbox" })}
                />

                <Group position="right" mt="md">
                  <Button type="button" variant="outline" onClick={form.reset}>
                    Reset
                  </Button>
                  <Button type="submit">Submit</Button>
                </Group>
              </Stack>
            </form>
          </Paper>

          <div>
            <Paper withBorder p="xl" radius="md" mb="lg">
              <Title order={3} mb="md">
                Form State
              </Title>
              <Text mb="md">
                This section shows the current state of the form, including values and validation errors.
              </Text>

              <Divider mb="md" />

              <div className="mb-4">
                <Text fw={500} mb="xs">
                  Values:
                </Text>
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-auto max-h-[200px] text-xs">
                  {JSON.stringify(form.values, null, 2)}
                </pre>
              </div>

              <div>
                <Text fw={500} mb="xs">
                  Errors:
                </Text>
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-auto max-h-[200px] text-xs">
                  {Object.keys(form.errors).length > 0 ? JSON.stringify(form.errors, null, 2) : "No errors"}
                </pre>
              </div>
            </Paper>

            {submitted && (
              <Alert icon={<Check size={16} />} title="Form submitted successfully!" color="green">
                <Text mb="md">Your form has been submitted with the following data:</Text>
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-auto max-h-[200px] text-xs">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </Alert>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
