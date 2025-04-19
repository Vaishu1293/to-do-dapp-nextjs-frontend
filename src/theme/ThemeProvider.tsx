"use client";

import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Wait for theme to hydrate
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid rendering until mounted on client
    return <div className="invisible" />;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
