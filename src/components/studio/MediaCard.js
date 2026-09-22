import Image from "next/image";

export function MediaCard({ item }) {
  const isVideo = item.type === "video";

  return (
    <div
      className="tone-ring relative overflow-hidden rounded-card-lg border border-line bg-raised"
      style={{ aspectRatio: `${item.width} / ${item.height}`, "--tone": item.tone }}
      tabIndex={0}
    >
      {isVideo ? (
        <video
          className="media-develop h-full w-full object-cover"
          src={item.src}
          poster={item.poster}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <Image
          src={item.src}
          alt={item.prompt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="media-develop object-cover"
        />
      )}
    </div>
  );
}
