"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useToneLink } from "@/components/studio/ToneLink";

export function MediaCard({ item, onOpen }) {
  const [loaded, setLoaded] = useState(false);
  const isVideo = item.type === "video";
  const link = useToneLink().linkProps(item);
  const cardRef = useRef(null);

  const handleOpen = () => onOpen?.(cardRef.current);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleOpen();
    }
  };

  return (
    <div
      ref={cardRef}
      {...link}
      role="button"
      aria-label={`Open ${item.prompt}`}
      aria-haspopup="dialog"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
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
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover ${loaded ? "media-develop" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}
