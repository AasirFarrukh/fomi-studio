"use client";

import { memo, useRef } from "react";
import { Composer } from "@/components/studio/Composer";
import { IconButton } from "@/components/ui/IconButton";
import { OrbitBorder } from "@/components/ui/OrbitBorder";
import { ChevronIcon, PenIcon, SparkIcon } from "@/components/ui/icons";

function igniteLabel(isLoading, hasDraft) {
  if (isLoading) return "Developing… — cancel";
  return hasDraft ? "Generate" : "Write a prompt";
}

// The inline composer from tablet up. On desktop it is simply the panel; between
// 640 and 1024 it folds into an icon rail (see .composer-host in globals.css)
// that keeps generate/cancel within reach while the feed takes the width.
export const ComposerDock = memo(function ComposerDock({
  composerProps,
  showComposer,
  expanded,
  onExpand,
  onCollapse,
  onIgnite,
}) {
  const expandRef = useRef(null);
  const isLoading = composerProps.status === "loading";
  const hasDraft = composerProps.prompt.trim().length > 0;

  const handleCollapse = () => {
    onCollapse();
    requestAnimationFrame(() => expandRef.current?.focus());
  };

  return (
    <div
      className="composer-host rounded-panel border border-line bg-surface shadow-panel max-sm:hidden"
      data-expanded={expanded || undefined}
    >
      <div className="composer-rail" inert={expanded}>
        <IconButton ref={expandRef} label="Open composer" aria-expanded={false} onClick={onExpand}>
          <PenIcon />
          {hasDraft ? (
            <span aria-hidden="true" className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-fill" />
          ) : null}
        </IconButton>
        <IconButton
          label={igniteLabel(isLoading, hasDraft)}
          aria-busy={isLoading || undefined}
          active={!isLoading && hasDraft}
          onClick={onIgnite}
        >
          <SparkIcon />
          {isLoading ? <OrbitBorder /> : null}
        </IconButton>
      </div>

      {showComposer ? (
        <Composer
          {...composerProps}
          className="composer-full p-4"
          headerAction={
            <IconButton label="Collapse composer" aria-expanded onClick={handleCollapse} className="lg:hidden">
              <ChevronIcon direction="left" className="h-4 w-4" />
            </IconButton>
          }
        />
      ) : null}
    </div>
  );
});
