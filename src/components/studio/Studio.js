"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HistoryTray } from "@/components/studio/HistoryTray";
import { Composer } from "@/components/studio/Composer";
import { ComposerDock } from "@/components/studio/ComposerDock";
import { ComposerBar } from "@/components/studio/ComposerBar";
import { IconButton } from "@/components/ui/IconButton";
import { ChevronIcon } from "@/components/ui/icons";
import { Feed } from "@/components/studio/Feed";
import { RecipeFlight } from "@/components/studio/RecipeFlight";
import { GenerationAnnouncer } from "@/components/studio/GenerationAnnouncer";
import { ToneLinkProvider } from "@/components/studio/ToneLink";
import { QuickLookProvider } from "@/components/studio/QuickLook";
import { useGeneration } from "@/hooks/useGeneration";
import { useRecipeFlight } from "@/hooks/useRecipeFlight";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { COMPACT_QUERY, RAIL_QUERY, REDUCED_MOTION_QUERY } from "@/lib/mediaQueries";
import { readDurationMs } from "@/lib/motion";
import { imageModels, videoModels } from "@/data/models";

const MODELS = { image: imageModels, video: videoModels };

// Neither dialog (nor the Radix primitives under them) ships in the main
// bundle: the lightbox loads when media is first opened, the sheet only on
// phones, after hydration.
const Lightbox = dynamic(
  () => import("@/components/studio/Lightbox").then((mod) => mod.Lightbox),
  { ssr: false },
);
const BottomSheet = dynamic(
  () => import("@/components/ui/BottomSheet").then((mod) => mod.BottomSheet),
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

export function Studio({ initialGenerations }) {
  const [mode, setMode] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(4);
  const [modelId, setModelId] = useState(imageModels[0].id);
  const [aspectRatio, setAspectRatio] = useState(imageModels[0].ratios[0]);
  const [generations, setGenerations] = useState(initialGenerations);
  const [lightboxData, setLightboxData] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [railExpanded, setRailExpanded] = useState(false);
  // Dialogs portal into this node rather than <body> so they stay inside
  // [data-mode] and pick up the active mode's accent.
  const [modeRoot, setModeRoot] = useState(null);

  const isCompact = useMediaQuery(COMPACT_QUERY);
  const isRail = useMediaQuery(RAIL_QUERY);

  // The sheet only exists on phones; leaving that size (rotation, resize)
  // closes it so the inline composer is the only one mounted.
  if (!isCompact && sheetOpen) setSheetOpen(false);

  const promptRef = useRef(null);
  const { status, items, error, progress, stage, generate, retry, cancel } = useGeneration();
  const { flight, launch, land, landedPulse } = useRecipeFlight(promptRef);

  const currentModels = MODELS[mode];

  const handleModeChange = useCallback(
    (nextMode) => {
      setMode(nextMode);
      const [first] = MODELS[nextMode];
      setModelId(first.id);
      setAspectRatio(first.ratios[0]);
    },
    [],
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
      const list = MODELS[type];
      const model = list.find((entry) => entry.id === generation.modelId) ?? list[0];

      setMode(type);
      setPrompt(generation.prompt);
      setModelId(model.id);
      setAspectRatio(
        model.ratios.includes(generation.aspectRatio)
          ? generation.aspectRatio
          : model.ratios[0],
      );
      promptRef.current?.focus();
    },
    [],
  );

  // Opens whichever composer is currently folded away. Returns whether anything
  // had to move, so callers know to wait for it to settle.
  const revealComposer = useCallback(() => {
    if (isCompact && !sheetOpen) {
      setSheetOpen(true);
      return true;
    }
    if (isRail && !railExpanded) {
      setRailExpanded(true);
      return true;
    }
    return false;
  }, [isCompact, isRail, sheetOpen, railExpanded]);

  const handleReuse = useCallback(
    (generation, sourceEl) => {
      const fly = () => launch(generation.prompt, sourceEl, () => applyRecipe(generation));
      if (!revealComposer()) {
        fly();
        return;
      }
      // The sheet rises and the rail widens over --duration-slow; wait it out so
      // the flight measures the prompt box where it finally rests.
      const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      window.setTimeout(
        () => requestAnimationFrame(fly),
        reduced ? 0 : readDurationMs("--duration-slow"),
      );
    },
    [launch, applyRecipe, revealComposer],
  );

  const handleExpandRail = useCallback(() => {
    setRailExpanded(true);
    requestAnimationFrame(() => promptRef.current?.focus({ preventScroll: true }));
  }, []);

  const handleCollapseRail = useCallback(() => setRailExpanded(false), []);

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

  const handleIgnite = useCallback(() => {
    if (status === "loading") cancel();
    else if (prompt.trim()) handleSubmit();
    else handleExpandRail();
  }, [status, prompt, cancel, handleSubmit, handleExpandRail]);

  const handleSheetSubmit = useCallback(() => {
    setSheetOpen(false);
    handleSubmit();
  }, [handleSubmit]);

  const handleRetry = useCallback(async () => {
    const items = await retry();
    const generation = itemsToGeneration(items);
    if (generation) {
      setGenerations((prev) => [generation, ...prev]);
    }
  }, [retry]);

  const handleOpenSheet = useCallback(() => setSheetOpen(true), []);

  // Stable between progress ticks, so the memoised dock, feed and tray sit out
  // the ~220ms re-renders a run drives through the header.
  const composerProps = useMemo(
    () => ({
      mode,
      onModeChange: handleModeChange,
      prompt,
      onPromptChange: setPrompt,
      promptRef,
      count,
      onCountChange: setCount,
      aspectRatio,
      onAspectRatioChange: setAspectRatio,
      modelId,
      onModelChange: handleModelChange,
      models: currentModels,
      status,
      onSubmit: handleSubmit,
      onCancel: cancel,
      landedPulse,
    }),
    [mode, handleModeChange, prompt, count, aspectRatio, modelId, handleModelChange, currentModels, status, handleSubmit, cancel, landedPulse],
  );

  return (
    <ToneLinkProvider>
      <QuickLookProvider>
        <div ref={setModeRoot} data-mode={mode} className="flex min-h-screen flex-col bg-bg">
          <SiteHeader
            mode={mode}
            onModeChange={handleModeChange}
            status={status}
            progress={progress}
            stage={stage}
            onHomeClick={handleHomeClick}
          />
          <GenerationAnnouncer status={status} stage={stage} items={items} error={error} />
          <main className="studio-body page-frame flex flex-1 flex-col gap-4 py-4">
            <HistoryTray generations={generations} />
            <div className="flex flex-1 flex-col gap-4 sm:flex-row">
              <ComposerDock
                composerProps={composerProps}
                showComposer={!isCompact}
                expanded={railExpanded}
                onExpand={handleExpandRail}
                onCollapse={handleCollapseRail}
                onIgnite={handleIgnite}
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
          </main>
          <ComposerBar
            mode={mode}
            prompt={prompt}
            status={status}
            stage={stage}
            open={sheetOpen}
            onOpen={handleOpenSheet}
          />
          {isCompact ? (
            <BottomSheet
              open={sheetOpen}
              onOpenChange={setSheetOpen}
              title="Composer"
              container={modeRoot}
            >
              <Composer
                {...composerProps}
                onSubmit={handleSheetSubmit}
                headerAction={
                  <IconButton label="Close composer" onClick={() => setSheetOpen(false)}>
                    <ChevronIcon direction="down" className="h-4 w-4" />
                  </IconButton>
                }
              />
            </BottomSheet>
          ) : null}
          <RecipeFlight key={flight?.id ?? "idle"} flight={flight} onLand={land} />
          {lightboxData ? (
            <Lightbox
              data={lightboxData}
              open={lightboxOpen}
              onOpenChange={handleLightboxOpenChange}
              onReuse={handleReuse}
              onExited={handleLightboxExited}
              container={modeRoot}
            />
          ) : null}
        </div>
      </QuickLookProvider>
    </ToneLinkProvider>
  );
}
