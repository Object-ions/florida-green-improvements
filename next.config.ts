import type { NextConfig } from "next";
import { LEGACY_REDIRECTS } from "./src/lib/business";

/**
 * Security headers live here rather than in netlify.toml.
 *
 * Netlify's context-specific header blocks REPLACE the top-level [[headers]]
 * block rather than merging with it, so a `[context.deploy-preview.headers]`
 * entry silently dropped three of the four headers on preview deploys. Setting
 * them in Next means they hold on every host and in every deploy context, and
 * there is one source of truth instead of two.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  /**
   * Every legacy WordPress URL 301s to its new home. Skipping this at cutover
   * throws away whatever ranking the old site has — the single most expensive
   * mistake available during a replatform.
   */
  async redirects() {
    return LEGACY_REDIRECTS.map((r) => ({
      source: r.from,
      destination: r.to,
      permanent: true,
    }));
  },
};

export default nextConfig;
