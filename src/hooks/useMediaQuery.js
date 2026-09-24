"use client";

import { useCallback, useSyncExternalStore } from "react";

// Server snapshot is always false, so SSR renders the desktop tree; anything that
// must not flash on small screens is hidden in CSS until this resolves on the client.
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
