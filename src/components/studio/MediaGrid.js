import { MediaCard } from "@/components/studio/MediaCard";

export function MediaGrid({ items, generation, eagerCount = 0, onOpenLightbox }) {
  return (
    <div className="media-grid">
      {items.map((item, index) => (
        <MediaCard
          key={item.id}
          item={item}
          position={index + 1}
          total={items.length}
          eager={index < eagerCount}
          onOpen={(sourceEl) => onOpenLightbox?.(generation, item, sourceEl)}
        />
      ))}
    </div>
  );
}
