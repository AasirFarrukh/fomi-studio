"use client";

import { createContext, useContext, useMemo, useState } from "react";

// One generation's ambient colour, shared by every surface that shows it. The
// hovered/focused item lights its own ring and glow, and every sibling from the
// same generation — including its history thumbnails — picks up the same tone,
// so a run can be traced across the feed and the tray at a glance.
//
// Touch has no hover — a tap fires enter and leave back to back — so a tap can
// also pin a tone, which holds until the same item is tapped again. A live hover
// or focus always wins over the pin.
const ToneLinkContext = createContext(null);

function toEntry(item) {
  return { itemId: item.id, generationId: item.generationId, tone: item.tone };
}

export function ToneLinkProvider({ children }) {
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  const active = hovered ?? pinned;

  const value = useMemo(() => {
    const hold = (item) => setHovered(toEntry(item));
    const release = () => setHovered(null);

    return {
      togglePin(item) {
        setPinned((current) => (current?.itemId === item.id ? null : toEntry(item)));
      },
      linkProps(item) {
        const state =
          active?.itemId === item.id
            ? "active"
            : active?.generationId === item.generationId
              ? "linked"
              : undefined;

        return {
          className: "tone-target",
          "data-tone": state,
          style: { "--tone": state ? active.tone : item.tone },
          onPointerEnter: () => hold(item),
          onPointerLeave: release,
          onFocus: () => hold(item),
          onBlur: release,
        };
      },
    };
  }, [active]);

  return <ToneLinkContext.Provider value={value}>{children}</ToneLinkContext.Provider>;
}

export function useToneLink() {
  return useContext(ToneLinkContext);
}
