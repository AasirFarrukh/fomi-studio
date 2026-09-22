"use client";

import { useState } from "react";
import Image from "next/image";

export function HistoryTray({ generations }) {
  const [expanded, setExpanded] = useState(false);
  const items = generations.flatMap((generation) => generation.items);

  if (items.length === 0) {
    return (
      <div className="rounded-panel border border-line bg-surface px-5 py-4">
        <p className="font-display text-lg text-ink">History</p>
        <p className="text-sm text-muted">Your generations will appear here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-panel border border-line bg-surface p-3">
      <div
        className={`flex gap-3 ${expanded ? "flex-wrap" : "flex-nowrap overflow-x-auto"}`}
      >
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex w-28 shrink-0 flex-col items-start justify-center gap-1 rounded-card-lg bg-raised px-4 py-3 text-left"
        >
          <span className="font-display text-base text-ink">History</span>
          <span className="text-xs text-accent underline-offset-2 hover:underline">
            {expanded ? "Show recent" : "View all"}
          </span>
        </button>
        {items.map((item) => (
          <a
            key={item.id}
            href={`#gen-${item.generationId}`}
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-card border border-line"
          >
            <Image
              src={item.poster ?? item.src}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
