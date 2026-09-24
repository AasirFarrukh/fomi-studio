"use client";

import { memo, useRef } from "react";
import { LocalTime } from "@/components/ui/LocalTime";

export const PromptCard = memo(function PromptCard({ generation, onReuse }) {
  const promptRef = useRef(null);

  return (
    <div className="prompt-card flex flex-wrap items-start justify-between gap-3 rounded-card-lg border border-line bg-surface px-4 py-3">
      <p ref={promptRef} className="max-w-2xl text-sm leading-relaxed text-ink">
        {generation.prompt}
      </p>
      <div className="flex flex-wrap items-center gap-2 whitespace-nowrap">
        <span className="rounded-chip border border-line bg-raised px-2.5 py-1 font-data text-xs text-muted">
          {generation.model}
        </span>
        <span className="font-data text-xs text-muted">{generation.aspectRatio}</span>
        <LocalTime iso={generation.createdAt} className="font-data text-xs text-muted" />
        <button
          type="button"
          onClick={() => onReuse(generation, promptRef.current)}
          className="press-spring hit-area relative rounded-chip border border-line px-2.5 py-1 text-xs font-medium text-accent transition-colors duration-base hover:bg-raised"
        >
          Reuse
        </button>
      </div>
    </div>
  );
});
