"use client";

import { useSyncExternalStore } from "react";
import { formatTime } from "@/lib/format";

const subscribe = () => () => {};

// The server can't know the viewer's timezone, so the time is only filled in on
// the client; the fixed width keeps anything beside it from shifting when it does.
export function LocalTime({ iso, className = "" }) {
  const text = useSyncExternalStore(subscribe, () => formatTime(iso), () => "");

  return (
    <time dateTime={iso} className={`inline-block min-w-[8ch] ${className}`}>
      {text}
    </time>
  );
}
