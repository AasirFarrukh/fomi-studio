"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { revealFrom } from "@/lib/themeReveal";

export const ThemeContext = createContext(null);

const STORAGE_KEY = "fomi-theme";

function getInitialTheme() {
  if (typeof document === "undefined") return "dark";
  const current = document.documentElement.getAttribute("data-theme");
  return current === "light" || current === "dark" ? current : "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const followSystem = (event) => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      const next = event.matches ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      setThemeState(next);
    };
    media.addEventListener("change", followSystem);
    return () => media.removeEventListener("change", followSystem);
  }, []);

  const setTheme = useCallback((next) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage may be unavailable (private browsing); theme still applies for the session.
    }
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(
    (origin) => {
      revealFrom(origin, () => {
        const current = document.documentElement.getAttribute("data-theme");
        flushSync(() => setTheme(current === "dark" ? "light" : "dark"));
      });
    },
    [setTheme],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
