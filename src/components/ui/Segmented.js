const PREV_KEYS = ["ArrowLeft", "ArrowUp"];
const NEXT_KEYS = ["ArrowRight", "ArrowDown"];

// A single-choice switch with no panels behind it, so it is a radio group:
// one tab stop, arrows move the choice and the focus together.
export function Segmented({ label, options, value, onChange }) {
  const activeIndex = options.findIndex((option) => option.value === value);

  function handleKeyDown(event) {
    const last = options.length - 1;
    let next = null;
    if (PREV_KEYS.includes(event.key)) next = activeIndex === 0 ? last : activeIndex - 1;
    else if (NEXT_KEYS.includes(event.key)) next = activeIndex === last ? 0 : activeIndex + 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;

    event.preventDefault();
    onChange(options[next].value);
    event.currentTarget.querySelectorAll('[role="radio"]')[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="relative grid rounded-chip border border-line bg-surface p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
    >
      <div
        aria-hidden="true"
        className="segment-indicator absolute inset-y-1 left-1 rounded-chip bg-accent-fill"
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
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={`relative z-10 rounded-chip px-4 py-2 text-sm touch:min-h-11 font-medium transition-colors duration-base ${
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
