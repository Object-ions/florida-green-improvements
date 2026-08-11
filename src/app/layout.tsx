import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { ConsentProvider } from "@/components/consent";
import { BUSINESS } from "@/lib/business";
import "./globals.css";

/* ── TYPE ─────────────────────────────────────────────────────────────
   Display : Archivo variable — width axis pulled to condensed, set light
             and huge. The Vault never uses weight to shout.
   Body    : Newsreader — editorial serif, holds up on a dark ground.
   Data    : Archivo at normal width — labels, eyebrows, metrics. A tracked
             monospace at 10px was unreadable; this is the same superfamily
             as the display, differentiated by width rather than by face.   */
const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"], // variable width — the condensed cut is set in globals.css
  variable: "--font-archivo",
  display: "swap",
});

const body = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.floridagreenimprovements.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `${BUSINESS.name} | Roofing, Impact Windows & Remodeling in North Miami Beach`,
    template: `%s | ${BUSINESS.name}`,
  },
  description:
    "Licensed general contractor serving Miami-Dade and Broward. Roofing, impact windows and hurricane protection, kitchens, baths, pools and full remodels. Rated 5.0 from 44 Google reviews. Licence CGC1529180.",
  applicationName: BUSINESS.name,
  authors: [{ name: BUSINESS.name }],
  creator: BUSINESS.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE,
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} | Roofing, Impact Windows & Remodeling`,
    description:
      "Licensed general contractor in North Miami Beach. Rated 5.0 from 44 Google reviews. Licence CGC1529180.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.name} | Roofing, Impact Windows & Remodeling`,
    description:
      "Licensed general contractor in North Miami Beach. Rated 5.0 from 44 Google reviews.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Self-verifies Search Console the moment this ships on the domain.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#08130E",
  colorScheme: "dark",
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
