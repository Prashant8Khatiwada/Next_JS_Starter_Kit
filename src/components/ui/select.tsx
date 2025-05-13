import { forwardRef } from "react";
import { Select, SelectProps } from "@mantine/core";

interface SelectFieldProps extends SelectProps {
  data: { value: string; label: string }[];
  label?: string;
  placeholder?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  clearable?: boolean;
  searchable?: boolean;
}

export const SelectField = forwardRef<HTMLInputElement, SelectFieldProps>(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      data,
      error,
      required,
      clearable = false,
      searchable = false,
      className,
      ...props
    },
    ref
  ) => {
    const updatedLabel = required ? `${label}${label ? " *" : "*"}` : label;

    return (
      <div className="flex flex-col gap-1">
        <Select
          ref={ref}
          label={updatedLabel}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          data={data}
          error={error}
          required={required}
          clearable={clearable}
          searchable={searchable}
          className={className}
          withAsterisk={false}
          {...props}
        />
      </div>
    );
  }
);

SelectField.displayName = "SelectField";

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
//   error: {
//     display: "none",
//   },
// }}
