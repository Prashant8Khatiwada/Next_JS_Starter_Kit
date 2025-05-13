import Link from "next/link"
import { Text } from "@mantine/core"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 no-underline">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
        <Text className="text-white font-bold">N</Text>
      </div>
      <Text size="xl" weight={700} className="text-gray-900 dark:text-white">
        NextKit
      </Text>
    </Link>
  )
}
