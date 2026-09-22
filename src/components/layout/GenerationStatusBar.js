export function GenerationStatusBar({ status, progress, stage }) {
  const isLoading = status === "loading";

  return (
    <div
      className="hidden md:flex flex-1 items-center gap-3 rounded-chip border border-line bg-surface px-4 py-2 transition-opacity duration-base"
      style={{ opacity: isLoading ? 1 : 0.35 }}
      role="status"
      aria-live="polite"
    >
      <div className="h-1.5 flex-1 overflow-hidden rounded-chip bg-line">
        <div
          className="h-full rounded-chip bg-accent-fill transition-[width] duration-base ease-out"
          style={{ width: `${isLoading ? Math.round(progress * 100) : 0}%` }}
        />
      </div>
      <span className="whitespace-nowrap text-xs text-muted">
        {isLoading ? stage : "Ready"}
      </span>
    </div>
  );
}
