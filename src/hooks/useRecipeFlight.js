"use client";

import { useCallback, useRef, useState } from "react";

// Measures a FLIP between the prompt a user clicked and wherever the composer
// input currently sits, then hands the landing back to the caller so the
// composer fills at the end of the flight rather than the start of it.
export function useRecipeFlight(targetRef) {
  const [flight, setFlight] = useState(null);
  const landingRef = useRef(null);

  const launch = useCallback(
    (label, sourceEl, onLand) => {
      const target = targetRef.current;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!sourceEl || !target || reduced) {
        onLand();
        return;
      }

      landingRef.current = onLand;
      setFlight({
        id: `${Date.now()}`,
        label,
        from: sourceEl.getBoundingClientRect(),
        to: target.getBoundingClientRect(),
      });
    },
    [targetRef],
  );

  const land = useCallback(() => {
    const onLand = landingRef.current;
    landingRef.current = null;
    setFlight(null);
    onLand?.();
  }, []);

  return { flight, launch, land };
}
