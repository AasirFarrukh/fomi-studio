const VARIANTS = {
  primary:
    "bg-accent-fill text-on-accent hover:brightness-105 active:brightness-95",
  ghost: "bg-transparent text-ink border border-line hover:bg-surface",
  raised: "bg-raised text-ink border border-line hover:bg-surface",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-chip px-5 py-2.5 text-sm font-medium transition-[filter,background-color] duration-base disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
