export function Tabs({ options, value, onChange }) {
  const activeIndex = options.findIndex((option) => option.value === value);

  return (
    <div
      role="tablist"
      className="relative grid rounded-chip border border-line bg-surface p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
    >
      <div
        aria-hidden="true"
        className="tab-indicator absolute inset-y-1 left-1 rounded-chip bg-accent-fill"
        style={{
          width: `calc(${100 / options.length}% - 4px)`,
          transform: `translateX(calc(${activeIndex} * 100%))`,
        }}
      />
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={`relative z-10 rounded-chip px-4 py-2 text-sm font-medium transition-colors duration-base ${
              isActive ? "text-on-accent" : "text-muted hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
