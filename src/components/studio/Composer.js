"use client";

import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Disclosure } from "@/components/ui/Disclosure";

const MODE_OPTIONS = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
];

const COUNT_OPTIONS = [1, 2, 4, 8].map((n) => ({ value: String(n), label: `${n} image${n > 1 ? "s" : ""}` }));

export function Composer({
  mode,
  onModeChange,
  prompt,
  onPromptChange,
  count,
  onCountChange,
  aspectRatio,
  onAspectRatioChange,
  modelId,
  onModelChange,
  models,
  status,
  onSubmit,
  onCancel,
}) {
  const isLoading = status === "loading";
  const currentModel = models.find((model) => model.id === modelId) ?? models[0];
  const ratioOptions = (currentModel?.ratios ?? ["1:1"]).map((ratio) => ({
    value: ratio,
    label: ratio,
  }));

  return (
    <section
      aria-label="Composer"
      className="flex w-full flex-col gap-4 rounded-panel border border-line bg-surface p-4 shadow-panel md:w-[340px]"
    >
      <Tabs options={MODE_OPTIONS} value={mode} onChange={onModeChange} />

      <div className="flex flex-col gap-3 rounded-card-lg border border-line bg-raised p-3">
        <textarea
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          placeholder={
            mode === "video"
              ? "Describe the shot you want to develop…"
              : "Describe the image you want to develop…"
          }
          rows={4}
          className="resize-none bg-transparent text-sm text-ink placeholder:text-muted outline-none"
        />
        <Button
          variant="primary"
          className="press-spring w-full"
          disabled={isLoading || prompt.trim().length === 0}
          onClick={onSubmit}
        >
          {isLoading ? "Developing…" : "Generate"}
        </Button>
        {isLoading ? (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-muted underline-offset-2 hover:underline"
          >
            Cancel
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          label="Count"
          value={String(count)}
          onChange={(value) => onCountChange(Number(value))}
          options={COUNT_OPTIONS}
        />
        <Select
          label="Ratio"
          value={aspectRatio}
          onChange={onAspectRatioChange}
          options={ratioOptions}
        />
        <Select
          label="Model"
          value={modelId}
          onChange={onModelChange}
          options={models.map((model) => ({ value: model.id, label: model.name }))}
        />
      </div>

      <Disclosure title="Advanced">
        Guidance strength, seed locking, and negative prompts land here once the
        model layer supports them.
      </Disclosure>
      <Disclosure title="Styles">
        Saved style presets will appear here once you create your first one.
      </Disclosure>
    </section>
  );
}
