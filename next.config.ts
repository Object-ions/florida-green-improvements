import type { NextConfig } from "next";
import { LEGACY_REDIRECTS } from "./src/lib/business";

/**
 * Every legacy WordPress URL 301s to its new home. Skipping this at cutover
 * throws away whatever ranking the old site has — the single most expensive
 * mistake available during a replatform.
 */
const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return LEGACY_REDIRECTS.map((r) => ({
      source: r.from,
      destination: r.to,
      permanent: true,
    }));
  },
};

export default nextConfig;
