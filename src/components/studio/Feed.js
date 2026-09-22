import { PromptCard } from "@/components/studio/PromptCard";
import { MediaGrid } from "@/components/studio/MediaGrid";
import { EmptyState } from "@/components/studio/EmptyState";

export function Feed({ generations, status, stage, error, onRetry, onReuse, pendingCount, mode }) {
  const hasContent = generations.length > 0;
  const showEmpty = !hasContent && status !== "loading" && status !== "error";

  return (
    <div className="flex flex-1 flex-col gap-6">
      {status === "loading" ? (
        <div className="flex flex-col gap-3 rounded-panel border border-line bg-surface px-4 py-4">
          <p className="text-sm text-muted">{stage}…</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: pendingCount }).map((_, index) => (
              <div
                key={index}
                className="aspect-square animate-pulse rounded-card-lg bg-raised"
              />
            ))}
          </div>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="flex items-center justify-between gap-4 rounded-panel border border-line bg-surface px-4 py-4">
          <p className="text-sm text-ink">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="whitespace-nowrap text-sm font-medium text-accent underline-offset-2 hover:underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      {showEmpty ? <EmptyState mode={mode} /> : null}

      {generations.map((generation) => (
        <div
          key={generation.generationId}
          id={`gen-${generation.generationId}`}
          className="flex scroll-mt-6 flex-col gap-3"
        >
          <PromptCard generation={generation} onReuse={onReuse} />
          <MediaGrid items={generation.items} />
        </div>
      ))}
    </div>
  );
}
