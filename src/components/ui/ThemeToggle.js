"use client";

import { useTheme } from "@/hooks/useTheme";
import { IconButton } from "@/components/ui/IconButton";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <IconButton
      label={isDark ? "Switch to Paper theme" : "Switch to Darkroom theme"}
      onClick={(event) => {
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        toggleTheme({ x: left + width / 2, y: top + height / 2 });
      }}
      suppressHydrationWarning
    >
      <span className="relative block h-4 w-4">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={`absolute inset-0 h-4 w-4 transition-opacity duration-base ${
            isDark ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
          suppressHydrationWarning
        >
          <path
            d="M13.5 9.6A5.6 5.6 0 0 1 6.4 2.5 5.8 5.8 0 1 0 13.5 9.6Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={`absolute inset-0 h-4 w-4 transition-opacity duration-base ${
            isDark ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden="true"
          suppressHydrationWarning
        >
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M8 1.2v1.8M8 13v1.8M2.4 8H.6M15.4 8h-1.8M3.5 3.5l1.3 1.3M11.2 11.2l1.3 1.3M12.5 3.5l-1.3 1.3M4.8 11.2 3.5 12.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </IconButton>
  );
}
