import { IconNav } from "@/components/layout/IconNav";
import { GenerationStatusBar } from "@/components/layout/GenerationStatusBar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

export function SiteHeader({ mode, onModeChange, status, progress, stage, onHomeClick }) {
  return (
    <header className="border-b border-line">
      <div className="page-frame flex flex-col py-3 sm:gap-4 sm:py-4">
        <div className="flex items-center gap-4">
          <span className="font-display text-2xl font-bold text-ink" aria-hidden="true">
            F
          </span>
          <span className="sr-only">Fomi Studio</span>

          <GenerationStatusBar status={status} progress={progress} stage={stage} />

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" disabled title="Gallery — coming soon" className="max-sm:hidden">
              Gallery
            </Button>
            <Button variant="ghost" disabled title="Support — coming soon" className="max-sm:hidden">
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
      </div>
    </header>
  );
}
