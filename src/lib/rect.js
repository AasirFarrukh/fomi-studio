// A rect is unusable as a flight/transform origin once its source has been
// scrolled out of layout (e.g. under content-visibility:auto) or unmounted —
// treat anything effectively collapsed as absent rather than animate to/from it.
export function getUsableRect(el) {
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width < 4 || rect.height < 4) return null;
  return rect;
}
