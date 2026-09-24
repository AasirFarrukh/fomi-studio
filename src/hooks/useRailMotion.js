"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { readDurationMs } from "@/lib/motion";
import { RAIL_QUERY, REDUCED_MOTION_QUERY } from "@/lib/mediaQueries";

// Media tiles, prompt cards, and the feed's own full-width blocks (loading,
// error, empty state) — everything that moves when the feed narrows or widens.
const TILES = ".generation > .prompt-card, .media-grid > [role='button'], [data-feed-block]";
const ANIMATION_ID = "rail";

function cancelRailAnimations(elements) {
  for (const el of elements) {
    for (const animation of el.getAnimations()) {
      if (animation.id === ANIMATION_ID) animation.cancel();
    }
  }
}

function inView(rect) {
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

// The tablet rail changes the feed's width, and the feed's column count follows
// that width. Transitioning the width itself re-laid-out and repainted every
// card on every frame (p95 36–48ms frames at 4x CPU throttling), so instead the
// feed reflows once and each visible tile is FLIPped from where it was to where
// it now sits with transforms only, while the panel's edge is revealed with
// clip-path over the same duration and curve — so the first column tracks it.
//
// Call the returned `capture` just before toggling `expanded`; tiles are
// measured as they currently appear, so a toggle mid-flight picks up smoothly.
export function useRailMotion(expanded, hostRef, feedRef) {
  const snapshotRef = useRef(null);

  const capture = useCallback(() => {
    const feed = feedRef.current;
    const skip =
      !feed ||
      !window.matchMedia(RAIL_QUERY).matches ||
      window.matchMedia(REDUCED_MOTION_QUERY).matches;
    snapshotRef.current = skip
      ? null
      : new Map([...feed.querySelectorAll(TILES)].map((el) => [el, el.getBoundingClientRect()]));
  }, [feedRef]);

  useLayoutEffect(() => {
    const from = snapshotRef.current;
    snapshotRef.current = null;
    const host = hostRef.current;
    if (!from || !host) return;

    cancelRailAnimations([host, ...from.keys()]);
    if (expanded) delete host.dataset.closing;
    else host.dataset.closing = "";

    const root = getComputedStyle(document.documentElement);
    const timing = {
      id: ANIMATION_ID,
      duration: readDurationMs("--duration-slow"),
      easing: root.getPropertyValue("--ease-out-expo").trim(),
    };

    const hostStyle = getComputedStyle(host);
    const radius = hostStyle.borderTopLeftRadius;
    const covered = host.offsetWidth - parseFloat(hostStyle.getPropertyValue("--rail-w"));
    const railOnly = `inset(0 ${covered}px 0 0 round ${radius})`;
    const open = `inset(0 0 0 0 round ${radius})`;
    const reveal = host.animate({ clipPath: expanded ? [railOnly, open] : [open, railOnly] }, timing);
    if (!expanded) {
      reveal.finished.then(() => delete host.dataset.closing).catch(() => {});
    }

    for (const [el, before] of from) {
      if (!el.isConnected) continue;
      const after = el.getBoundingClientRect();
      if (!inView(before) && !inView(after)) continue;
      // Media keeps its aspect ratio, so it scales uniformly about its centre;
      // text blocks would smear, so they only travel (by their left edge) and
      // take their new width. Only transform is keyframed — adding
      // transform-origin would pull the animation off the compositor.
      const isText = !el.matches("[role='button']");
      const scale = isText ? 1 : before.width / after.width;
      const dx = isText
        ? before.left - after.left
        : before.left + before.width / 2 - (after.left + after.width / 2);
      const dy = isText
        ? before.top - after.top
        : before.top + before.height / 2 - (after.top + after.height / 2);
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(scale - 1) < 0.002) continue;
      el.animate(
        [{ transform: `translate(${dx}px, ${dy}px) scale(${scale})` }, { transform: "none" }],
        timing,
      );
    }
  }, [expanded, hostRef]);

  return capture;
}
