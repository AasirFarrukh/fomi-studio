// Reads a duration token (e.g. "--duration-slow") off the root so JS waits on
// exactly the value the CSS transition or animation runs for.
export function readDurationMs(token) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const value = Number.parseFloat(raw);
  return raw.endsWith("ms") ? value : value * 1000;
}
