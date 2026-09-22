"use client";

import { createContext, useContext, useMemo, useState } from "react";

// One generation's ambient colour, shared by every surface that shows it. The
// hovered/focused item lights its own ring and glow, and every sibling from the
// same generation — including its history thumbnails — picks up the same tone,
// so a run can be traced across the feed and the tray at a glance.
const ToneLinkContext = createContext(null);

export function ToneLinkProvider({ children }) {
  const [active, setActive] = useState(null);

  const value = useMemo(() => {
    const hold = (item) =>
      setActive({ itemId: item.id, generationId: item.generationId, tone: item.tone });
    const release = () => setActive(null);

    return {
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
