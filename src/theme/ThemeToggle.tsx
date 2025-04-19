"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="cursor-pointer hover:bg-hover-background active:bg-active-background rounded-md border border-button-border-color p-1.5"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="dark:hidden">🌞</span>
      <span className="hidden dark:inline">🌙</span>
    </button>
  );
}
