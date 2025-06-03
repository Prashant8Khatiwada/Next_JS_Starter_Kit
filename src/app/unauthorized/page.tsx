import { Container, Title, Text, Button, Group } from "@mantine/core";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <Container className="py-16 text-center">
      <Title className="text-6xl font-extrabold mb-6">403</Title>
      <Text size="xl" className="mb-6">
        You don't have permission to access this page
      </Text>
      <Text size="sm" c="dimmed" className="mb-8">
        Please contact your administrator if you believe this is an error.
      </Text>
      <Group justify="center">
        <Button component={Link} href="/" variant="subtle" size="md">
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}
