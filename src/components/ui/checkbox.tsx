import { Checkbox as MantineCheckbox } from "@mantine/core";
import { cn } from "@/src/lib/utils";
import * as React from "react";

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof MantineCheckbox>
>(({ className, onChange, checked, ...props }, ref) => (
  <MantineCheckbox
    ref={ref}
    className={cn("peer cursor-pointer", className)}
    checked={checked}
    onChange={onChange}
    styles={{
      root: {
        display: "flex",
        alignItems: "center",
      },
      input: {
        width: "1.25rem",
        height: "1.25rem",
        borderRadius: "0.125rem",
        border: "1px solid black",
        "&:checked": {
          backgroundColor: "var(--primary)",
          borderColor: "var(--primary)",
        },
        "&:focus": {
          outline: "none",
          boxShadow: "0 0 0 2px var(--ring)",
        },
        "&:disabled": {
          cursor: "not-allowed",
          opacity: 0.5,
        },
      },
      label: {
        display: "flex",
        marginTop: "0.25rem",
        alignItems: "center",
      },
    }}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";

const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-3", className)}
    role="group"
    {...props}
  >
    {children}
  </div>
));
CheckboxGroup.displayName = "CheckboxGroup";

export { Checkbox, CheckboxGroup };
