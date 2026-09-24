"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useToneLink } from "@/components/studio/ToneLink";

function HistoryThumb({ item }) {
  const toneLink = useToneLink();
  const link = toneLink.linkProps(item);
  const pointerTypeRef = useRef("mouse");

  return (
    <a
      {...link}
      href={`#gen-${item.generationId}`}
      onPointerDown={(event) => {
        pointerTypeRef.current = event.pointerType;
      }}
      onClick={() => {
        if (pointerTypeRef.current !== "mouse") toneLink.togglePin(item);
      }}
      className={`relative h-16 w-16 shrink-0 snap-start overflow-hidden rounded-card border border-line sm:h-20 sm:w-20 ${link.className}`}
    >
      <Image
        src={item.poster ?? item.src}
        alt=""
        fill
        sizes="80px"
        className="object-cover"
      />
    </a>
  );
}

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
    <section
      aria-label="History"
      className="flex flex-col gap-3 overflow-hidden rounded-panel border border-line bg-surface p-3 sm:flex-row"
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
        className="flex shrink-0 items-baseline justify-between gap-2 px-2 text-left sm:w-28 sm:flex-col sm:items-start sm:justify-center sm:gap-1 sm:rounded-card-lg sm:bg-raised sm:px-4 sm:py-3"
      >
        <span className="flex items-baseline gap-2">
          <span className="font-display text-base text-ink">History</span>
          <span className="font-data text-xs text-muted">{items.length}</span>
        </span>
        <span className="text-xs text-accent underline-offset-2 hover:underline">
          {expanded ? "Show recent" : "View all"}
        </span>
      </button>
      <div
        className={`-mx-3 flex min-w-0 flex-1 gap-3 px-3 sm:mx-0 sm:px-0 ${
          expanded
            ? "flex-wrap"
            : "flex-nowrap overflow-x-auto max-sm:snap-x max-sm:snap-mandatory max-sm:scroll-px-3"
        }`}
      >
        {items.map((item) => (
          <HistoryThumb key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
