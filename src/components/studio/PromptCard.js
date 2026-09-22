"use client";

import { useRef } from "react";
import { formatTime } from "@/lib/format";

export function PromptCard({ generation, onReuse }) {
  const promptRef = useRef(null);

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-card-lg border border-line bg-surface px-4 py-3">
      <p ref={promptRef} className="max-w-2xl text-sm leading-relaxed text-ink">
        {generation.prompt}
      </p>
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="rounded-chip border border-line bg-raised px-2.5 py-1 font-data text-xs text-muted">
          {generation.model}
        </span>
        <span className="font-data text-xs text-muted">{generation.aspectRatio}</span>
        <span className="font-data text-xs text-muted">
          {formatTime(generation.createdAt)}
        </span>
        <button
          type="button"
          onClick={() => onReuse(generation, promptRef.current)}
          className="press-spring rounded-chip border border-line px-2.5 py-1 text-xs font-medium text-accent transition-colors duration-base hover:bg-raised"
        >
          Reuse
        </button>
      </div>
    </div>
  );
}
