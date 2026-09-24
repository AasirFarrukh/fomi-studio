// Visual only: GenerationAnnouncer carries the same stages to assistive tech.
// Idle, just the track dims — the label stays at full muted contrast.
export function GenerationStatusBar({ status, progress, stage }) {
  const isLoading = status === "loading";

  return (
    <div
      aria-hidden="true"
      className="hidden sm:flex flex-1 items-center gap-3 rounded-chip border border-line bg-surface px-4 py-2"
    >
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-chip bg-line transition-opacity duration-base"
        style={{ opacity: isLoading ? 1 : 0.35 }}
      >
        <div
          className="h-full rounded-chip bg-accent-fill transition-[width] duration-base ease-out motion-reduce:transition-none"
          style={{ width: `${isLoading ? Math.round(progress * 100) : 0}%` }}
        />
      </div>
      <span className="whitespace-nowrap text-xs text-muted">
        {isLoading ? stage : "Ready"}
      </span>
    </div>
  );
}
