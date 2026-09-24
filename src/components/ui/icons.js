const CHEVRON_PATHS = {
  left: "M12.5 5 7.5 10l5 5",
  right: "M7.5 5l5 5-5 5",
  up: "M5 12.5 10 7.5l5 5",
  down: "M5 7.5l5 5 5-5",
};

export function ChevronIcon({ direction, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path
        d={CHEVRON_PATHS[direction]}
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SparkIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path
        d="M10 2.5c.5 3.8 1.9 5.2 5.7 5.7-3.8.5-5.2 1.9-5.7 5.7-.5-3.8-1.9-5.2-5.7-5.7 3.8-.5 5.2-1.9 5.7-5.7ZM15.5 13.5c.2 1.4.7 1.9 2 2-1.3.2-1.8.7-2 2-.2-1.3-.7-1.8-2-2 1.3-.1 1.8-.6 2-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PenIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path
        d="M13.2 3.8a1.9 1.9 0 0 1 2.7 2.7L7 15.4l-3.5.9.9-3.5ZM11.8 5.2l2.8 2.8"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
