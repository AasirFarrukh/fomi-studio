export function IconButton({
  label,
  children,
  active = false,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-base ${
        active
          ? "border-transparent bg-accent-fill text-on-accent"
          : "border-line bg-surface text-ink hover:bg-raised"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
