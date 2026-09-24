"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useToneLink } from "@/components/studio/ToneLink";
import { useQuickLookTarget } from "@/components/studio/QuickLook";

export function MediaCard({ item, position, total, onOpen }) {
  const [loaded, setLoaded] = useState(false);
  const isVideo = item.type === "video";
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

  const handlePointerEnter = () => {
    link.onPointerEnter();
    setQuickLookTarget?.(item, cardRef.current);
  };

  const handlePointerLeave = () => {
    link.onPointerLeave();
    setQuickLookTarget?.(null, null);
  };

  const handleFocus = () => {
    link.onFocus();
    setQuickLookTarget?.(item, cardRef.current);
  };

  const handleBlur = () => {
    link.onBlur();
    setQuickLookTarget?.(null, null);
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
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`relative overflow-hidden rounded-card-lg border border-line bg-raised ${link.className}`}
      style={{ aspectRatio: `${item.width} / ${item.height}`, ...link.style }}
    >
      {isVideo ? (
        <video
          className={`h-full w-full object-cover ${loaded ? "media-develop" : "opacity-0"}`}
          src={item.src}
          poster={item.poster}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setLoaded(true)}
        />
      ) : (
        <Image
          src={item.src}
          alt={item.prompt}
          fill
          sizes="(min-width: 1536px) 16vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={`object-cover ${loaded ? "media-develop" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}
