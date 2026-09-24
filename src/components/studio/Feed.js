import { memo } from "react";
import { PromptCard } from "@/components/studio/PromptCard";
import { MediaGrid } from "@/components/studio/MediaGrid";
import { EmptyState } from "@/components/studio/EmptyState";

// The newest run's first row — two cells on phones, four on desktop — skips
// lazy loading so it starts developing as soon as the HTML lands. No higher
// fetch priority: cards fade in, so they are never the LCP, and the hoisted
// preloads measured slower against the text that is.
const FIRST_ROW = 4;

export const Feed = memo(function Feed({
  feedRef,
  generations,
  status,
  stage,
  error,
  onRetry,
  onReuse,
  onOpenLightbox,
  pendingCount,
  mode,
}) {
  const hasContent = generations.length > 0;
  const showEmpty = !hasContent && status !== "loading" && status !== "error";

  return (
    <div ref={feedRef} className="@container/feed flex min-w-0 flex-1 flex-col gap-6">
      {status === "loading" ? (
        <div data-feed-block className="flex flex-col gap-3 rounded-panel border border-line bg-surface px-4 py-4">
          <p className="text-sm text-muted">{stage}…</p>
          <div className="media-grid">
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
        <div data-feed-block className="flex items-center justify-between gap-4 rounded-panel border border-line bg-surface px-4 py-4">
          <p className="text-sm text-ink">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="whitespace-nowrap text-sm font-medium text-accent touch:min-h-11 underline-offset-2 hover:underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      {showEmpty ? <EmptyState mode={mode} /> : null}

      {generations.map((generation, index) => (
        <div
          key={generation.generationId}
          id={`gen-${generation.generationId}`}
          className="generation flex scroll-mt-6 flex-col gap-3"
          style={{ "--count": generation.items.length }}
        >
          <PromptCard generation={generation} onReuse={onReuse} />
          <MediaGrid
            items={generation.items}
            generation={generation}
            eagerCount={index === 0 ? FIRST_ROW : 0}
            onOpenLightbox={onOpenLightbox}
          />
        </div>
      ))}
    </div>
  );
});
