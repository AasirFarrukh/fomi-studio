"use client";

import { useEffect, useState } from "react";

// Keyed on flight.id by the caller, so every launch mounts a fresh ghost that
// paints once at the source rect before the transition to the composer starts.
export function RecipeFlight({ flight, onLand }) {
  const [inFlight, setInFlight] = useState(false);

  useEffect(() => {
    if (!flight) return undefined;

    const frame = requestAnimationFrame(() => setInFlight(true));
    const timer = setTimeout(onLand, 340);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [flight, onLand]);

  if (!flight) return null;

  const { from, to, label } = flight;

  return (
    <div
      aria-hidden="true"
      className="recipe-ghost"
      data-in-flight={inFlight || undefined}
      style={{
        left: `${from.left}px`,
        top: `${from.top}px`,
        width: `${from.width}px`,
        "--fly-x": `${to.left - from.left}px`,
        "--fly-y": `${to.top - from.top}px`,
        "--fly-scale": Math.min(to.width / from.width, 1),
      }}
    >
      {label}
    </div>
  );
}
