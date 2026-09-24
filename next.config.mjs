/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "*.picsum.photos" },
    ],
    // Sources top out at 1152px (see lib/media.js), so the default 1920–3840
    // widths only repeat the largest file and pad every srcset in the HTML.
    deviceSizes: [640, 828, 1080, 1200],
    imageSizes: [96, 128, 256, 384],
  },
};

export default nextConfig;
