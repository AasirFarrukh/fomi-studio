"use client";

import { useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";

const DISMISS_DISTANCE = 96;
const DISMISS_VELOCITY = 0.5;

// A modal sheet anchored to the bottom edge. Dragging the handle moves the sheet
// with the finger through --drag-y; letting go past DISMISS_DISTANCE, or with a
// downward flick faster than DISMISS_VELOCITY (px/ms), closes it, and the close
// animation starts from wherever the finger left it.
export function BottomSheet({ open, onOpenChange, title, container, children }) {
  const contentRef = useRef(null);
  const dragRef = useRef(null);

  function handlePointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startY: event.clientY, lastY: event.clientY, lastTime: event.timeStamp, velocity: 0 };
    contentRef.current.dataset.dragging = "";
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    if (!drag) return;
    const elapsed = event.timeStamp - drag.lastTime;
    if (elapsed > 0) drag.velocity = (event.clientY - drag.lastY) / elapsed;
    drag.lastY = event.clientY;
    drag.lastTime = event.timeStamp;
    const offset = Math.max(0, event.clientY - drag.startY);
    contentRef.current.style.setProperty("--drag-y", `${offset}px`);
  }

  function handlePointerEnd() {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    const content = contentRef.current;
    delete content.dataset.dragging;
    if (drag.lastY - drag.startY > DISMISS_DISTANCE || drag.velocity > DISMISS_VELOCITY) {
      onOpenChange(false);
    } else {
      content.style.setProperty("--drag-y", "0px");
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={container}>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content ref={contentRef} className="sheet-content" aria-describedby={undefined}>
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <div
            aria-hidden="true"
            className="sheet-handle"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          >
            <span className="sheet-grip" />
          </div>
          <div className="sheet-body">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
