// Mirrors Tailwind's sm / lg breakpoints so JS layout decisions never disagree with CSS.
export const COMPACT_QUERY = "(max-width: 639.98px)";
export const RAIL_QUERY = "(min-width: 640px) and (max-width: 1023.98px)";

// Primary pointer only: a touch laptop driven by trackpad and keyboard still gets Quick Look.
export const COARSE_POINTER_QUERY = "(pointer: coarse)";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
