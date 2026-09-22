import { formatTime } from "@/lib/format";

export function PromptCard({ prompt, model, createdAt }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-card-lg border border-line bg-surface px-4 py-3">
      <p className="max-w-2xl text-sm leading-relaxed text-ink">{prompt}</p>
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="rounded-chip border border-line bg-raised px-2.5 py-1 font-data text-xs text-muted">
          {model}
        </span>
        <span className="font-data text-xs text-muted">{formatTime(createdAt)}</span>
      </div>
    </div>
  );
}
