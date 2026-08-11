import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/business";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.floridagreenimprovements.com";

/**
 * A real sitemap. The old site declared SEVENTY-NINE of these in robots.txt
 * and every single one returned HTML instead of XML (baseline finding F-01),
 * so Google has never had a usable map of this site.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.9 },
    ...SERVICES.map((s) => ({
      url: `${SITE}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
