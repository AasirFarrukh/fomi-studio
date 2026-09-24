import { memo } from "react";
import { OrbitBorder } from "@/components/ui/OrbitBorder";
import { ChevronIcon, SparkIcon } from "@/components/ui/icons";

// Phones only: the composer's collapsed form, docked above the tab bar. It
// mirrors the draft (or the run's stage) and opens the full composer sheet.
export const ComposerBar = memo(function ComposerBar({ mode, prompt, status, stage, open, onOpen }) {
  const isLoading = status === "loading";
  const draft = prompt.trim();
  const placeholder = mode === "video" ? "Describe the shot to develop…" : "Describe the image to develop…";

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-busy={isLoading || undefined}
      onClick={onOpen}
      className="composer-bar fixed inset-x-4 z-30 flex h-12 items-center gap-3 rounded-chip border border-line bg-raised px-4 shadow-card sm:hidden"
    >
      <SparkIcon className="h-4 w-4 shrink-0 text-accent" />
      <span className="sr-only">Open composer: </span>
      <span className={`min-w-0 flex-1 truncate text-left text-sm ${draft && !isLoading ? "text-ink" : "text-muted"}`}>
        {isLoading ? `${stage}…` : draft || placeholder}
      </span>
      <ChevronIcon direction="up" className="h-4 w-4 shrink-0 text-muted" />
      {isLoading ? <OrbitBorder radius={24} /> : null}
    </button>
  );
});
