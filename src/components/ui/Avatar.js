export function Avatar({ initials, className = "" }) {
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-raised border border-line text-xs font-semibold text-ink ${className}`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
