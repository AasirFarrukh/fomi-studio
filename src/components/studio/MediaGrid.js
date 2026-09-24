import { MediaCard } from "@/components/studio/MediaCard";

export function MediaGrid({ items, generation, onOpenLightbox }) {
  return (
    <div className="media-grid">
      {items.map((item) => (
        <MediaCard
          key={item.id}
          item={item}
          onOpen={(sourceEl) => onOpenLightbox?.(generation, item, sourceEl)}
        />
      ))}
    </div>
  );
}
