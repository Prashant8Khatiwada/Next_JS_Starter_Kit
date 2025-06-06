"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/src/lib/utils";

interface AvatarProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    "src" | "alt"
  > {
  src?: string;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, src, alt, fallback, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  >
    {src && (
      <AvatarPrimitive.Image
        src={src}
        alt={alt}
        className="aspect-square h-full w-full"
      />
    )}
    {fallback && (
      <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted">
        {fallback}
      </AvatarPrimitive.Fallback>
    )}
  </AvatarPrimitive.Root>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

export { Avatar };
