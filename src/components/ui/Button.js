import { OrbitBorder } from "@/components/ui/OrbitBorder";

const VARIANTS = {
  primary:
    "bg-accent-fill text-on-accent hover:brightness-105 active:brightness-95",
  ghost: "bg-transparent text-ink border border-line hover:bg-surface",
  raised: "bg-raised text-ink border border-line hover:bg-surface",
};

const BUSY_VARIANT = "bg-raised text-ink";

export function Button({
  variant = "primary",
  busy = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  const look = busy ? BUSY_VARIANT : VARIANTS[variant];
  const dimWhenDisabled = busy ? "" : "disabled:opacity-50";

  return (
    <button
      type="button"
      aria-busy={busy || undefined}
      disabled={disabled}
      className={`relative inline-flex min-h-11 items-center justify-center gap-2 rounded-chip px-5 py-2.5 text-sm font-medium transition-[filter,background-color] duration-mode disabled:pointer-events-none ${dimWhenDisabled} ${look} ${className}`}
      {...props}
    >
      {children}
      {busy ? <OrbitBorder /> : null}
    </button>
  );
}
