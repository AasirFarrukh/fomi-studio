"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const QuickLookContext = createContext(null);

function isTypingTarget(el) {
  if (!el) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  return tag === "TEXTAREA" || tag === "INPUT" || tag === "SELECT";
}

// The lightbox is the only dialog in the app; if one is open, Space belongs to it.
function isDialogOpen() {
  return document.querySelector('[role="dialog"]') !== null;
}

export function QuickLookProvider({ children }) {
  const targetRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const setTarget = useCallback((item, element) => {
    targetRef.current = item && element ? { item, element } : null;
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.code !== "Space" || event.repeat) return;

      const active = document.activeElement;
      if (isTypingTarget(active) || isDialogOpen()) return;

      const target = targetRef.current;
      if (!target) return;

      // Only trust the hover/focus target when nothing else has claimed focus —
      // a stale hover shouldn't hijack Space from a focused control elsewhere.
      const activeIsCard = active === target.element;
      const activeIsNeutral = !active || active === document.body || active === document.documentElement;
      if (!activeIsCard && !activeIsNeutral) return;

      event.preventDefault();
      setPreview(target);
    }

    function dismiss() {
      setPreview(null);
    }

    function handleKeyUp(event) {
      if (event.code === "Space") dismiss();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", dismiss);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", dismiss);
    };
  }, []);

  return (
    <QuickLookContext.Provider value={setTarget}>
      {children}
      {preview ? <QuickLookOverlay item={preview.item} /> : null}
    </QuickLookContext.Provider>
  );
}

export function useQuickLookTarget() {
  return useContext(QuickLookContext);
}

function QuickLookOverlay({ item }) {
  const isVideo = item.type === "video";

  return (
    <div aria-hidden="true" className="quicklook-backdrop">
      <div className="quicklook-frame" style={{ "--tone": item.tone }}>
        {isVideo ? (
          <video
            className="quicklook-media"
            src={item.src}
            poster={item.poster}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="quicklook-media" src={item.src} alt="" />
        )}
        <p className="quicklook-caption">{item.prompt}</p>
      </div>
    </div>
  );
}
