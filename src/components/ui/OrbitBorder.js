const RECT_PROPS = { x: 0, y: 0, width: "100%", height: "100%", rx: 20, pathLength: 100, fill: "none" };

export function OrbitBorder() {
  return (
    <svg aria-hidden="true" className="orbit-border">
      <rect {...RECT_PROPS} className="orbit-track" />
      <rect {...RECT_PROPS} className="orbit-tail" />
      <rect {...RECT_PROPS} className="orbit-head" />
    </svg>
  );
}
