import { MediaCard } from "@/components/studio/MediaCard";

export function MediaGrid({ items, generation, onOpenLightbox }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
