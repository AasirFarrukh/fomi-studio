export function Select({ label, value, onChange, options, className = "" }) {
  return (
    <label
      className={`flex items-center gap-1.5 rounded-chip touch:min-h-11 border border-line bg-surface px-3 py-2 text-sm text-ink ${className}`}
    >
      {label ? <span className="text-muted">{label}</span> : null}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent font-medium outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
