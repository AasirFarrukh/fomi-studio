"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { formatTime } from "@/lib/format";
import { getUsableRect } from "@/lib/rect";

const SWIPE_THRESHOLD = 48;
const EDGE_BUMP_MS = 260;

function preloadNeighbor(item) {
  if (!item) return () => {};
  if (item.type === "video") {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.src = item.src;
    return () => {
      video.src = "";
    };
  }
  const img = new window.Image();
  img.src = item.src;
  return () => {};
}

export function Lightbox({ data, open, onOpenChange, onReuse, onExited }) {
  const { generation, itemId, sourceEl } = data;
  const items = generation.items;
  const startIndex = Math.max(
    items.findIndex((entry) => entry.id === itemId),
    0,
  );
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [edgeBump, setEdgeBump] = useState(null);
  const item = items[activeIndex];

  // The Lightbox instance can outlive a single "open" if a new item opens
  // before the previous close animation finishes unmounting it — resync.
  useEffect(() => {
    setActiveIndex(Math.max(items.findIndex((entry) => entry.id === itemId), 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, generation.generationId]);

  const contentRef = useRef(null);
  const touchStartRef = useRef(null);
  const edgeBumpTimerRef = useRef(null);
  const pendingReuseRef = useRef(null);

  const atStart = activeIndex === 0;
  const atEnd = activeIndex === items.length - 1;

  const bumpEdge = useCallback((edge) => {
    setEdgeBump(edge);
    window.clearTimeout(edgeBumpTimerRef.current);
    edgeBumpTimerRef.current = window.setTimeout(() => setEdgeBump(null), EDGE_BUMP_MS);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((current) => {
      if (current > 0) return current - 1;
      bumpEdge("start");
      return current;
    });
  }, [bumpEdge]);

  const goNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current < items.length - 1) return current + 1;
      bumpEdge("end");
      return current;
    });
  }, [bumpEdge, items.length]);

  useEffect(() => () => window.clearTimeout(edgeBumpTimerRef.current), []);

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, goPrev, goNext]);

  // Warm the immediate neighbors so an arrow press never shows a blank frame.
  useEffect(() => {
    const cleanups = [items[activeIndex - 1], items[activeIndex + 1]].map(preloadNeighbor);
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [items, activeIndex]);

  // Scale+fade in from the clicked card's own rect, not a generic center pop.
  const originRect = useMemo(() => (open ? getUsableRect(sourceEl) : null), [open, sourceEl]);
  const [originStyle, setOriginStyle] = useState(null);

  useLayoutEffect(() => {
    if (!open) return;
    if (!originRect || !contentRef.current) {
      setOriginStyle(null);
      return;
    }
    const box = contentRef.current.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) return;
    const originX = ((originRect.left + originRect.width / 2 - box.left) / box.width) * 100;
    const originY = ((originRect.top + originRect.height / 2 - box.top) / box.height) * 100;
    setOriginStyle({
      transformOrigin: `${clamp(originX, 0, 100)}% ${clamp(originY, 0, 100)}%`,
    });
  }, [open, originRect]);

  function handleTouchStart(event) {
    touchStartRef.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event) {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (start == null) return;
    const delta = event.changedTouches[0].clientX - start;
    if (delta > SWIPE_THRESHOLD) goPrev();
    else if (delta < -SWIPE_THRESHOLD) goNext();
  }

  // Waits out the dialog's own close animation before unmounting and, if a
  // reuse was requested, launching the flight — so it always plays against a
  // clear composer, never mid-dismiss.
  useEffect(() => {
    if (open) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      onExited();
      const reuse = pendingReuseRef.current;
      pendingReuseRef.current = null;
      reuse?.();
    }, reduced ? 120 : 200);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleReuse() {
    // The flight plays once the dialog has actually closed, landing in the
    // composer the same way PromptCard's reuse does.
    pendingReuseRef.current = () => onReuse(generation, sourceEl);
    onOpenChange(false);
  }

  function handleCopyPrompt() {
    navigator.clipboard?.writeText(item.prompt).catch(() => {});
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="lightbox-overlay" />
        <Dialog.Content
          ref={contentRef}
          className="lightbox-content"
          style={originStyle ?? undefined}
        >
          <Dialog.Title className="sr-only">{item.prompt}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {`${item.model}, ${item.aspectRatio}, generated ${formatTime(item.createdAt)}`}
          </Dialog.Description>
          <div className="lightbox-body">
            <div
              className="lightbox-media"
              data-edge-bump={edgeBump ?? undefined}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {item.type === "video" ? (
                <video
                  className="lightbox-media-el"
                  src={item.src}
                  poster={item.poster}
                  controls
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={item.src}
                  alt={item.prompt}
                  fill
                  sizes="80vw"
                  className="lightbox-media-el object-contain"
                  priority
                />
              )}

              <button
                type="button"
                aria-label="Previous"
                disabled={atStart}
                onClick={goPrev}
                className="lightbox-nav lightbox-nav-prev"
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                aria-label="Next"
                disabled={atEnd}
                onClick={goNext}
                className="lightbox-nav lightbox-nav-next"
              >
                <ChevronIcon direction="right" />
              </button>
            </div>

            <aside className="lightbox-panel" style={{ "--tone": item.tone }}>
              <p className="lightbox-prompt">{item.prompt}</p>
              <dl className="lightbox-meta">
                <div>
                  <dt>Model</dt>
                  <dd>{item.model}</dd>
                </div>
                <div>
                  <dt>Ratio</dt>
                  <dd className="font-data">{item.aspectRatio}</dd>
                </div>
                <div>
                  <dt>Seed</dt>
                  <dd className="font-data">{item.seed}</dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd className="font-data">{formatTime(item.createdAt)}</dd>
                </div>
              </dl>

              <div className="lightbox-actions">
                <a
                  href={item.src}
                  download
                  className="press-spring rounded-chip border border-line px-3 py-2 text-center text-xs font-medium text-ink transition-colors duration-base hover:bg-raised"
                >
                  Download
                </a>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="press-spring rounded-chip border border-line px-3 py-2 text-xs font-medium text-ink transition-colors duration-base hover:bg-raised"
                >
                  Copy prompt
                </button>
                <button
                  type="button"
                  onClick={handleReuse}
                  className="press-spring rounded-chip border border-line px-3 py-2 text-xs font-medium text-accent transition-colors duration-base hover:bg-raised"
                >
                  Reuse
                </button>
              </div>
            </aside>
          </div>

          <Dialog.Close aria-label="Close" className="lightbox-close">
            <CloseIcon />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function ChevronIcon({ direction }) {
  const d = direction === "left" ? "M12.5 5 7.5 10l5 5" : "M7.5 5l5 5-5 5";
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
      <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
