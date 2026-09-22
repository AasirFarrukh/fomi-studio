export const imageModels = [
  { id: "aurora-v3", name: "Aurora v3", ratios: ["1:1", "4:5", "16:9", "9:16"] },
  { id: "halide-xl", name: "Halide XL", ratios: ["1:1", "3:4", "16:9"] },
  { id: "lucid-fast", name: "Lucid Fast", ratios: ["1:1", "4:5", "9:16"] },
];

export const videoModels = [
  { id: "motion-reel", name: "Motion Reel", ratios: ["16:9", "9:16"] },
  { id: "flux-frame", name: "Flux Frame", ratios: ["1:1", "16:9"] },
];

export function findModel(type, modelId) {
  const list = type === "video" ? videoModels : imageModels;
  return list.find((model) => model.id === modelId) ?? list[0];
}
