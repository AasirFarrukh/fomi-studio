import { MediaCard } from "@/components/studio/MediaCard";

export function MediaGrid({ items, generation, onOpenLightbox }) {
  return (
    <div className="media-grid">
      {items.map((item, index) => (
        <MediaCard
          key={item.id}
          item={item}
          position={index + 1}
          total={items.length}
          onOpen={(sourceEl) => onOpenLightbox?.(generation, item, sourceEl)}
        />
      ))}
    </div>
  );
}
