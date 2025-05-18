import {
  Badge as MantineBadge,
  BadgeProps as MantineBadgeProps,
} from "@mantine/core";
import { cn } from "@/src/lib/utils";

interface BadgeProps extends MantineBadgeProps {}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <MantineBadge className={cn(className)} variant={variant} {...props} />
  );
}

export { Badge };
