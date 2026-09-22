const ICONS = {
  home: (
    <path
      d="M3 8.5 10 3l7 5.5V17a1 1 0 0 1-1 1h-3.5v-5.5h-5V18H4a1 1 0 0 1-1-1Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  image: (
    <>
      <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <circle cx="7.5" cy="8.5" r="1.4" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <path d="m5 14 3.5-3.5L11 13l2-2 3 3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="5.5" width="10" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M13.5 8.5 17 6.3v7.4l-3.5-2.2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
    </>
  ),
  wand: (
    <path
      d="M4 16 13 7M13 3.5v2M17 7.5h-2M16 4.4l-1.4 1.4M9.4 5.4 8 4M15.1 10.6l1.4 1.4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  ),
  folder: (
    <path
      d="M3 6a1 1 0 0 1 1-1h4l1.5 2H16a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      fill="none"
    />
  ),
};

function NavIcon({ name }) {
  return (
    <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export function IconNav({ mode, onModeChange }) {
  const items = [
    { key: "home", label: "Home", current: true },
    { key: "image", label: "Images", current: mode === "image", onClick: () => onModeChange("image") },
    { key: "video", label: "Videos", current: mode === "video", onClick: () => onModeChange("video") },
    { key: "wand", label: "Edit", disabled: true },
    { key: "folder", label: "Projects", disabled: true },
  ];

  return (
    <nav aria-label="Studio sections" className="flex items-center gap-1 rounded-chip border border-line bg-surface p-1">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          aria-label={item.label}
          aria-current={item.current ? "page" : undefined}
          aria-disabled={item.disabled || undefined}
          title={item.disabled ? `${item.label} — coming soon` : item.label}
          onClick={item.disabled ? undefined : item.onClick}
          className={`flex h-9 w-11 items-center justify-center rounded-chip transition-colors duration-mode ${
            item.disabled
              ? "text-muted/50 cursor-not-allowed"
              : item.current
                ? "bg-accent-fill text-on-accent"
                : "text-muted hover:text-ink hover:bg-raised"
          }`}
        >
          <NavIcon name={item.key} />
        </button>
      ))}
    </nav>
  );
}
