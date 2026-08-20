import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { ConsentProvider } from "@/components/consent";
import { BUSINESS } from "@/lib/business";
import "./globals.css";

/* ── TYPE ─────────────────────────────────────────────────────────────
   Display : Archivo variable — width axis pulled to condensed, set light
             and huge. The Vault never uses weight to shout.
   Body    : Inter — replaced Newsreader (editorial serif) at the client's
             request. The serif was a holdover from the dark "Vault" palette
             and read literary rather than trade. Inter is deliberately
             characterless: it lets the condensed Archivo headings carry the
             personality and does not compete with them.
   Data    : Archivo at normal width — labels, eyebrows, metrics. A tracked
             monospace at 10px was unreadable; this is the same superfamily
             as the display, differentiated by width rather than by face.   */
const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"], // variable width — the condensed cut is set in globals.css
  variable: "--font-archivo",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  // Not preloaded on purpose. The LCP element is the headline, set in Archivo;
  // preloading both fonts made them compete for bandwidth on throttled mobile
  // and pushed LCP out by ~1.8 s. Body copy can arrive a beat later.
  preload: false,
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.floridagreenimprovements.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `${BUSINESS.name} | Impact Windows, Kitchens & Outdoor Living`,
    template: `%s | ${BUSINESS.name}`,
  },
  description:
    "Licensed general contractor serving Miami-Dade and Broward. Hurricane-rated impact windows and doors, kitchens, bathrooms, full remodels, pools, turf and outdoor living. Rated 5.0 from 44 Google reviews. Licence CGC1529180.",
  applicationName: BUSINESS.name,
  authors: [{ name: BUSINESS.name }],
  creator: BUSINESS.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE,
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} | Impact Windows, Kitchens & Outdoor Living`,
    description:
      "Licensed general contractor in North Miami Beach. Rated 5.0 from 44 Google reviews. Licence CGC1529180.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.name} | Impact Windows, Kitchens & Outdoor Living`,
    description:
      "Licensed general contractor in North Miami Beach. Rated 5.0 from 44 Google reviews.",
  },
  /**
   * The site stays out of the index until it is live on the real domain.
   * Until then it is a review copy on a netlify.app subdomain, and letting
   * Google index that would create a duplicate competing with the client's
   * existing site. Flip NEXT_PUBLIC_INDEXABLE to "true" at DNS cutover.
   */
  robots:
    process.env.NEXT_PUBLIC_INDEXABLE === "true"
      ? {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
        }
      : { index: false, follow: false, nocache: true },
  // Self-verifies Search Console the moment this ships on the domain.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#FAFAF8",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Analytics origins are known at build time — preconnecting saves
            ~350ms of DNS + TLS on the first tracked event. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://c.clarity.ms" />
        {/* Set before first paint so the reveal styles apply with no flash —
            and so that a visitor without JS is never served a blank page. */}
        <script
          dangerouslySetInnerHTML={{
            __html: 'document.documentElement.classList.add("js")',
          }}
        />
      </head>
      {/* Extensions (ColorZilla, Grammarly, LastPass…) inject attributes onto
          <body> before React hydrates. Not our markup — but the mismatch is
          real, so <body> gets the same guard <html> already carries. */}
      <body suppressHydrationWarning>
        <a href="#main" className="skip-link">Skip to content</a>
        <ConsentProvider>
          {children}
          <Analytics />
        </ConsentProvider>
      </body>
    </html>
  );
}
