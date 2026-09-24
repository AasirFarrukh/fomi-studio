"use client";

import { useId, useState } from "react";

export function Disclosure({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="rounded-chip border border-line bg-raised">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-ink"
      >
        {title}
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform duration-base motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path
            d="M2 4.5 6 8.5 10 4.5"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div id={panelId} className="disclosure-content" data-open={open} inert={!open}>
        <div>
          <p className="px-4 pb-4 text-sm text-muted">{children}</p>
        </div>
      </div>
    </div>
  );
}
