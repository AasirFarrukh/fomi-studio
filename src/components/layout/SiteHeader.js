import { IconNav } from "@/components/layout/IconNav";
import { GenerationStatusBar } from "@/components/layout/GenerationStatusBar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

export function SiteHeader({ mode, onModeChange, status, progress, stage, onHomeClick }) {
  return (
    <header className="flex flex-col gap-4 border-b border-line px-6 py-4">
      <div className="flex items-center gap-4">
        <span className="font-display text-2xl font-bold text-ink" aria-hidden="true">
          F
        </span>
        <span className="sr-only">Fomi Studio</span>

        <GenerationStatusBar status={status} progress={progress} stage={stage} />

        <div className="flex items-center gap-2">
          <Button variant="ghost" disabled title="Gallery — coming soon">
            Gallery
          </Button>
          <Button variant="ghost" disabled title="Support — coming soon" className="hidden sm:inline-flex">
            Support
          </Button>
          <ThemeToggle />
          <Avatar initials="AF" />
        </div>
      </div>

      <div className="flex justify-center">
        <IconNav
          mode={mode}
          onModeChange={onModeChange}
          status={status}
          progress={progress}
          onHomeClick={onHomeClick}
        />
      </div>
    </header>
  );
}
