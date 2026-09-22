"use client";

import { useState } from "react";
import Image from "next/image";

export function MediaCard({ item }) {
  const [loaded, setLoaded] = useState(false);
  const isVideo = item.type === "video";

  return (
    <div
      className="tone-ring relative overflow-hidden rounded-card-lg border border-line bg-raised"
      style={{ aspectRatio: `${item.width} / ${item.height}`, "--tone": item.tone }}
      tabIndex={0}
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
