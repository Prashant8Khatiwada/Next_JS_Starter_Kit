import { forwardRef, useState } from "react";
import { TextInput, TextInputProps } from "@mantine/core";

interface InputFieldProps extends TextInputProps {
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  leftSectionWidth?: string | number;
  rightSectionWidth?: string | number;
}

// Use forwardRef to support ref forwarding, matching the original InputField
export const Input = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      error,
      required,
      disabled,
      className,
      leftSection,
      leftSectionWidth,
      rightSection,
      rightSectionWidth,
      ...props
    },
    ref
  ) => {
    // State for clearable input demo
    const [value, setValue] = useState("");

    return (
      <TextInput
        ref={ref}
        label={label}
        error={error}
        required={required}
        disabled={disabled}
        className={className}
        leftSection={leftSection}
        leftSectionWidth={leftSectionWidth}
        rightSection={rightSection}
        rightSectionWidth={rightSectionWidth}
        leftSectionPointerEvents="none" // Non-interactive icons
        rightSectionPointerEvents={rightSection ? "all" : "none"} // Allow interaction for rightSection (e.g., clear button)
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

// styles={{
//   label: {
//     fontSize: "1rem",
//     // marginBottom: "0.5rem",
//   },
//   input: {
//     padding: "0.75rem 0.625rem",
//     fontSize: "1rem",
//     "&::placeholder": {
//       fontSize: "1rem",
//     },
//   },
// }}
