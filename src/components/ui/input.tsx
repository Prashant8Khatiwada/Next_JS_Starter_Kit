import { forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  leftSection?: React.ReactNode;
  leftSectionWidth?: string | number;
  rightSection?: React.ReactNode;
  rightSectionWidth?: string | number;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      error,
      required,
      disabled,
      className,
      leftSection,
      leftSectionWidth = "2.5rem",
      rightSection,
      rightSectionWidth = "2.5rem",
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-base font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftSection && (
            <div
              className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
              style={{ width: leftSectionWidth }}
            >
              {leftSection}
            </div>
          )}
          <input
            ref={ref}
            className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors ${
              disabled ? "bg-gray-100 cursor-not-allowed opacity-50" : ""
            } ${error ? "border-red-500" : ""} ${
              leftSection
                ? `pl-${
                    typeof leftSectionWidth === "number"
                      ? Math.round(leftSectionWidth / 4) + 3
                      : 10
                  }`
                : ""
            } ${
              rightSection
                ? `pr-${
                    typeof rightSectionWidth === "number"
                      ? Math.round(rightSectionWidth / 4) + 3
                      : 10
                  }`
                : ""
            } ${className || ""}`}
            disabled={disabled}
            required={required}
            {...props}
          />
          {rightSection && (
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
              style={{ width: rightSectionWidth }}
            >
              {rightSection}
            </div>
          )}
        </div>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);

InputField.displayName = "InputField";
