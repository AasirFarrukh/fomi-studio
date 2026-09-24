export function OrbitBorder({ radius = 22 }) {
  const rectProps = { x: 0, y: 0, width: "100%", height: "100%", rx: radius, pathLength: 100, fill: "none" };

  return (
    <svg aria-hidden="true" className="orbit-border">
      <rect {...rectProps} className="orbit-track" />
      <rect {...rectProps} className="orbit-tail" />
      <rect {...rectProps} className="orbit-head" />
    </svg>
  );
}
