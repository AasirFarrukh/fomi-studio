"use client";

import { createContext, useCallback, useEffect, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

export const ThemeContext = createContext(null);

const STORAGE_KEY = "fomi-theme";

// The <html data-theme> attribute (set before paint by the inline bootstrap in
// layout.js) is the source of truth. Reading it as an external store lets
// hydration render the server's "dark" and then correct itself, instead of the
// client's first render silently disagreeing with the server HTML.
const listeners = new Set();

function readTheme() {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function applyTheme(next) {
  document.documentElement.setAttribute("data-theme", next);
  listeners.forEach((listener) => listener());
}

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const followSystem = (event) => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      applyTheme(event.matches ? "light" : "dark");
    };
    media.addEventListener("change", followSystem);
    return () => media.removeEventListener("change", followSystem);
  }, []);

  const setTheme = useCallback((next) => {
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage may be unavailable (private browsing); theme still applies for the session.
    }
  }, []);

  const toggleTheme = useCallback(
    (origin) => {
      // The View Transitions reveal is only needed on a click, so it loads then.
      import("@/lib/themeReveal").then(({ revealFrom }) => {
        revealFrom(origin, () => {
          flushSync(() => setTheme(readTheme() === "dark" ? "light" : "dark"));
        });
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
