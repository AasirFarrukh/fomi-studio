"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HistoryTray } from "@/components/studio/HistoryTray";
import { Composer } from "@/components/studio/Composer";
import { Feed } from "@/components/studio/Feed";
import { RecipeFlight } from "@/components/studio/RecipeFlight";
import { ToneLinkProvider } from "@/components/studio/ToneLink";
import { useGeneration } from "@/hooks/useGeneration";
import { useRecipeFlight } from "@/hooks/useRecipeFlight";
import {
  imageModels as fallbackImageModels,
  videoModels as fallbackVideoModels,
} from "@/data/models";

// No reason the dialog primitives ship in the main bundle — only fetched
// once someone actually opens a piece of media.
const Lightbox = dynamic(
  () => import("@/components/studio/Lightbox").then((mod) => mod.Lightbox),
  { ssr: false },
);

function itemsToGeneration(items) {
  if (!items || items.length === 0) return null;
  const [first] = items;
  return {
    generationId: first.generationId,
    prompt: first.prompt,
    type: first.type,
    model: first.model,
    modelId: first.modelId,
    aspectRatio: first.aspectRatio,
    createdAt: first.createdAt,
    items,
  };
}

export function Studio() {
  const [mode, setMode] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(4);
  const [models, setModels] = useState({
    image: fallbackImageModels,
    video: fallbackVideoModels,
  });
  const [modelId, setModelId] = useState(fallbackImageModels[0].id);
  const [aspectRatio, setAspectRatio] = useState(fallbackImageModels[0].ratios[0]);
  const [generations, setGenerations] = useState([]);
  const [lightboxData, setLightboxData] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const promptRef = useRef(null);
  const { status, error, progress, stage, generate, retry, cancel } = useGeneration();
  const { flight, launch, land, landedPulse } = useRecipeFlight(promptRef);

  useEffect(() => {
    let active = true;

    fetch("/api/models")
      .then((response) => response.json())
      .then((data) => {
        if (active) setModels(data);
      })
      .catch(() => {});

    fetch("/api/history")
      .then((response) => response.json())
      .then((data) => {
        if (active) setGenerations(data.generations ?? []);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const currentModels = useMemo(() => models[mode] ?? [], [models, mode]);

  const handleModeChange = useCallback(
    (nextMode) => {
      setMode(nextMode);
      const list = models[nextMode] ?? [];
      if (list.length > 0) {
        setModelId(list[0].id);
        setAspectRatio(list[0].ratios[0]);
      }
    },
    [models],
  );

  const handleModelChange = useCallback(
    (nextModelId) => {
      setModelId(nextModelId);
      const nextModel = currentModels.find((model) => model.id === nextModelId);
      if (nextModel && !nextModel.ratios.includes(aspectRatio)) {
        setAspectRatio(nextModel.ratios[0]);
      }
    },
    [currentModels, aspectRatio],
  );

  const handleSubmit = useCallback(async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    const items = await generate({
      prompt: trimmed,
      type: mode,
      count,
      aspectRatio,
      model: modelId,
    });
    const generation = itemsToGeneration(items);
    if (generation) {
      setGenerations((prev) => [generation, ...prev]);
    }
  }, [prompt, mode, count, aspectRatio, modelId, generate]);

  const applyRecipe = useCallback(
    (generation) => {
      const type = generation.type === "video" ? "video" : "image";
      const list = models[type] ?? [];
      const model = list.find((entry) => entry.id === generation.modelId) ?? list[0];

      setMode(type);
      setPrompt(generation.prompt);
      if (model) {
        setModelId(model.id);
        setAspectRatio(
          model.ratios.includes(generation.aspectRatio)
            ? generation.aspectRatio
            : model.ratios[0],
        );
      }
      promptRef.current?.focus();
    },
    [models],
  );

  const handleReuse = useCallback(
    (generation, sourceEl) => {
      launch(generation.prompt, sourceEl, () => applyRecipe(generation));
    },
    [launch, applyRecipe],
  );

  const handleHomeClick = useCallback(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    promptRef.current?.focus();
  }, []);

  const handleOpenLightbox = useCallback((generation, item, sourceEl) => {
    setLightboxData({ generation, itemId: item.id, sourceEl });
    setLightboxOpen(true);
  }, []);

  const handleLightboxOpenChange = useCallback((nextOpen) => {
    setLightboxOpen(nextOpen);
  }, []);

  const handleLightboxExited = useCallback(() => {
    setLightboxData(null);
  }, []);

  const handleRetry = useCallback(async () => {
    const items = await retry();
    const generation = itemsToGeneration(items);
    if (generation) {
      setGenerations((prev) => [generation, ...prev]);
    }
  }, [retry]);

  return (
    <ToneLinkProvider>
      <div data-mode={mode} className="flex min-h-screen flex-col bg-bg">
        <SiteHeader
          mode={mode}
          onModeChange={handleModeChange}
          status={status}
          progress={progress}
          stage={stage}
          onHomeClick={handleHomeClick}
        />
        <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:px-6">
          <HistoryTray generations={generations} />
          <div className="flex flex-1 flex-col gap-4 md:flex-row">
            <Composer
              mode={mode}
              onModeChange={handleModeChange}
              prompt={prompt}
              onPromptChange={setPrompt}
              promptRef={promptRef}
              count={count}
              onCountChange={setCount}
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
              modelId={modelId}
              onModelChange={handleModelChange}
              models={currentModels}
              status={status}
              onSubmit={handleSubmit}
              onCancel={cancel}
              landedPulse={landedPulse}
            />
            <Feed
              generations={generations}
              status={status}
              stage={stage}
              error={error}
              onRetry={handleRetry}
              onReuse={handleReuse}
              onOpenLightbox={handleOpenLightbox}
              pendingCount={count}
              mode={mode}
            />
          </div>
        </div>
      </div>
      <RecipeFlight key={flight?.id ?? "idle"} flight={flight} onLand={land} />
      {lightboxData ? (
        <Lightbox
          data={lightboxData}
          open={lightboxOpen}
          onOpenChange={handleLightboxOpenChange}
          onReuse={handleReuse}
          onExited={handleLightboxExited}
        />
      ) : null}
    </ToneLinkProvider>
  );
}
