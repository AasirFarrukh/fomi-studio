"use client";

import { useCallback, useRef, useState } from "react";

const STAGES = [
  { threshold: 0, label: "Reading prompt" },
  { threshold: 0.35, label: "Composing" },
  { threshold: 0.75, label: "Developing" },
];

function stageForProgress(progress) {
  return STAGES.reduce(
    (label, stage) => (progress >= stage.threshold ? stage.label : label),
    STAGES[0].label,
  );
}

export function useGeneration() {
  const [status, setStatus] = useState("idle");
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(STAGES[0].label);

  const abortRef = useRef(null);
  const intervalRef = useRef(null);
  const lastParamsRef = useRef(null);

  const clearProgressTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const generate = useCallback(
    async (params) => {
      lastParamsRef.current = params;
      const controller = new AbortController();
      abortRef.current = controller;

      setStatus("loading");
      setError(null);
      setProgress(0);
      setStage(STAGES[0].label);

      clearProgressTimer();
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = Math.min(prev + (1 - prev) * 0.12, 0.94);
          setStage(stageForProgress(next));
          return next;
        });
      }, 220);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Generation failed.");
        }

        clearProgressTimer();
        setProgress(1);
        setStage("Developing");
        setItems(data.items);
        setStatus("success");
        return data.items;
      } catch (err) {
        clearProgressTimer();
        if (err.name === "AbortError") {
          setStatus("idle");
          return null;
        }
        setError(err.message);
        setStatus("error");
        return null;
      }
    },
    [clearProgressTimer],
  );

  const retry = useCallback(() => {
    if (!lastParamsRef.current) return Promise.resolve(null);
    return generate(lastParamsRef.current);
  }, [generate]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    clearProgressTimer();
    setStatus("idle");
    setProgress(0);
  }, [clearProgressTimer]);

  return { status, items, error, progress, stage, generate, retry, cancel };
}
