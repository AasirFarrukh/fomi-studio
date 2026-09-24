// The one polite live region for a run, mounted at every size — the visual
// status bar is desktop-only — so each stage and then the outcome is read out
// without anyone having to go looking for it.
export function GenerationAnnouncer({ status, stage, items, error }) {
  return (
    <p role="status" className="sr-only">
      {announcement({ status, stage, items, error })}
    </p>
  );
}

function announcement({ status, stage, items, error }) {
  if (status === "loading") return `${stage}…`;
  if (status === "error") return `Generation failed. ${error}`;
  if (status === "cancelled") return "Generation cancelled.";
  if (status === "success" && items.length > 0) {
    const noun = items[0].type === "video" ? "clip" : "image";
    return `${items.length} ${noun}${items.length === 1 ? "" : "s"} developed.`;
  }
  return "";
}
