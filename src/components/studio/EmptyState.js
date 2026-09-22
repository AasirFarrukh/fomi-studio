export function EmptyState({ mode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-panel border border-dashed border-line px-6 py-16 text-center">
      <p className="font-display text-xl text-ink">Nothing developed yet</p>
      <p className="max-w-sm text-sm text-muted">
        Write a prompt on the left and generate your first {mode === "video" ? "clip" : "image"}
        {" "}— it will appear here as it develops.
      </p>
    </div>
  );
}
