import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        btn: {
          DEFAULT: '#0055ff',
          hover: '#0044cc',
          pressed: '#0033aa',
        },
        br: {
          DEFAULT: '#E5E7EB',
          focus: '#60A5FA',
          error: '#EF4444',
        },
        t: {
          DEFAULT: '#111827',
          primary: '#111827',
          secondary: '#6B7280',
          disabled: '#9CA3AF',
        },
        bg: {
          DEFAULT: '#FFFFFF',
          secondary: '#F3F4F6',
          tertiary: '#E5E7EB',
          disabled: '#F9FAFB',
        },
        accent: {
          DEFAULT: '#10B981',
          hover: '#059669',
          pressed: '#047857',
        },

        keyframes: {
          "accordion-down": {
            from: {
              height: "0",
            },
            to: {
              height: "var(--radix-accordion-content-height)",
            },
          },
          "accordion-up": {
            from: {
              height: "var(--radix-accordion-content-height)",
            },
            to: {
              height: "0",
            },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
        },
      },
    },
    plugins: [],
    // This ensures Tailwind doesn't conflict with Mantine's styles
    corePlugins: {
      preflight: false,
    },
  }
}
export default config
