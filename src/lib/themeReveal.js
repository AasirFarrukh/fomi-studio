// Mirrors --duration-develop and --ease-out-expo; the Web Animations API can't resolve var().
const REVEAL_DURATION_MS = 700;
const REVEAL_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

function farthestCornerDistance({ x, y }) {
  return Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
}

/**
 * Runs `applyChange` (which must update the DOM synchronously) and, where the
 * View Transitions API exists and motion is allowed, reveals the result as a
 * circle growing from `origin` until it covers the farthest viewport corner.
 * Everywhere else it just runs `applyChange` immediately.
 */
export function revealFrom(origin, applyChange) {
  const canTransition = typeof document.startViewTransition === "function";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canTransition || reduced || !origin) {
    applyChange();
    return;
  }

  const transition = document.startViewTransition(applyChange);
  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${farthestCornerDistance(origin)}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        {
          duration: REVEAL_DURATION_MS,
          easing: REVEAL_EASING,
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});
}
