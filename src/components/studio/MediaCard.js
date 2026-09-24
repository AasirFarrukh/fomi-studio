"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useToneLink } from "@/components/studio/ToneLink";
import { useQuickLookTarget } from "@/components/studio/QuickLook";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CLIP_PREVIEW_QUERY } from "@/lib/mediaQueries";

// Clips rest on their poster and only play while hovered or focused (never on
// their own, never under reduced motion), so nothing in the feed moves for
// more than a moment without being asked to; the lightbox has full controls.
export function MediaCard({ item, position, total, onOpen }) {
  const [loaded, setLoaded] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const isVideo = item.type === "video";
  const canPreview = useMediaQuery(CLIP_PREVIEW_QUERY);
  const link = useToneLink().linkProps(item);
  const setQuickLookTarget = useQuickLookTarget();
  const cardRef = useRef(null);

  const handleOpen = () => onOpen?.(cardRef.current);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleOpen();
    }
  };

  const engage = () => {
    setQuickLookTarget?.(item, cardRef.current);
    if (isVideo) setPreviewing(true);
  };

  const release = () => {
    setQuickLookTarget?.(null, null);
    setPreviewing(false);
    setPlaying(false);
  };

  return (
    <div
      ref={cardRef}
      {...link}
      role="button"
      aria-label={`Open ${isVideo ? "clip" : "image"} ${position} of ${total}: ${item.prompt}`}
      aria-haspopup="dialog"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      onPointerEnter={() => {
        link.onPointerEnter();
        engage();
      }}
      onPointerLeave={() => {
        link.onPointerLeave();
        release();
      }}
      onFocus={() => {
        link.onFocus();
        engage();
      }}
      onBlur={() => {
        link.onBlur();
        release();
      }}
      className={`relative overflow-hidden rounded-card-lg border border-line bg-raised ${link.className}`}
      style={{ aspectRatio: `${item.width} / ${item.height}`, ...link.style }}
    >
      <Image
        src={isVideo ? item.poster : item.src}
        alt={item.prompt}
        fill
        sizes="(min-width: 1536px) 16vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className={`object-cover ${loaded ? "media-develop" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
      {isVideo && previewing && canPreview ? (
        <video
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-base ${playing ? "opacity-100" : "opacity-0"}`}
          src={item.src}
          autoPlay
          muted
          loop
          playsInline
          onPlaying={() => setPlaying(true)}
        />
      ) : null}
      {isVideo ? (
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-2 flex items-center gap-1 rounded-chip bg-bg/70 px-2 py-0.5 font-data text-[11px] text-ink"
        >
          <svg viewBox="0 0 10 10" className="h-2 w-2">
            <path d="M2 1.2v7.6L8.6 5Z" fill="currentColor" />
          </svg>
          Clip
        </span>
      ) : null}
    </div>
  );
}
