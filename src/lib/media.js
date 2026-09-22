// Stands in for a real generation backend: deterministic per-seed images from
// picsum.photos and a small pool of sample clips. Swap the two resolvers below
// for ones backed by `public/media/` (or a real model) once that exists —
// callers only ever see { src, poster?, width, height }.

const RATIO_DIMENSIONS = {
  "1:1": [1024, 1024],
  "4:5": [896, 1120],
  "3:4": [864, 1152],
  "16:9": [1152, 648],
  "9:16": [648, 1152],
};

const VIDEO_SAMPLES = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/coffee.mp4",
];

export function dimensionsForRatio(ratio) {
  return RATIO_DIMENSIONS[ratio] ?? RATIO_DIMENSIONS["1:1"];
}

export function resolveMedia({ type, seed, ratio }) {
  const [width, height] = dimensionsForRatio(ratio);
  const imageSrc = `https://picsum.photos/seed/${seed}/${width}/${height}`;

  if (type === "video") {
    return {
      src: VIDEO_SAMPLES[seed % VIDEO_SAMPLES.length],
      poster: imageSrc,
      width,
      height,
    };
  }

  return { src: imageSrc, width, height };
}

export function toneFromSeed(seed) {
  const hue = seed % 360;
  return hslToHex(hue, 55, 52);
}

function hslToHex(h, s, l) {
  const sat = s / 100;
  const light = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n) =>
    light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (n) =>
    Math.round(f(n) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(0)}${toHex(8)}${toHex(4)}`;
}
