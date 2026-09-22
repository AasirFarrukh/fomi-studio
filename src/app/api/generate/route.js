import { NextResponse } from "next/server";
import { createId, createSeed } from "@/lib/id";
import { resolveMedia, toneFromSeed } from "@/lib/media";
import { addGeneration } from "@/lib/store";
import { findModel } from "@/data/models";

const MIN_DELAY_MS = 1200;
const MAX_DELAY_MS = 2500;
const FAILURE_RATE = 0.08;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request) {
  const body = await request.json();
  const prompt = (body.prompt ?? "").trim();
  const type = body.type === "video" ? "video" : "image";
  const count = Math.min(Math.max(Number(body.count) || 1, 1), 8);
  const aspectRatio = body.aspectRatio ?? "1:1";
  const model = findModel(type, body.model);

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  await wait(MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS));

  if (Math.random() < FAILURE_RATE) {
    return NextResponse.json(
      { error: "Generation failed. The model queue dropped this request." },
      { status: 500 },
    );
  }

  const generationId = createId("gen");
  const createdAt = new Date().toISOString();

  const items = Array.from({ length: count }, () => {
    const seed = createSeed();
    const media = resolveMedia({ type, seed, ratio: aspectRatio });
    return {
      id: createId("item"),
      generationId,
      type,
      ...media,
      prompt,
      model: model.name,
      modelId: model.id,
      aspectRatio,
      seed,
      tone: toneFromSeed(seed),
      createdAt,
    };
  });

  addGeneration({
    generationId,
    prompt,
    type,
    model: model.name,
    modelId: model.id,
    aspectRatio,
    createdAt,
    items,
  });

  return NextResponse.json({ items });
}
