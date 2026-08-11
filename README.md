# Florida Green Improvements

Website for [Florida Green Improvements](https://www.floridagreenimprovements.com) — a licensed
Florida general contractor (CGC1529180) in North Miami Beach, working across roofing, impact
glazing, air conditioning, solar, and full interior renovation in Miami-Dade and Broward.

Built by [Switch Case Studio](https://switchcasestudio.com).

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 with CSS custom properties |
| Components | shadcn/ui + React Bits Pro |
| Email | Resend |
| Analytics | Google Analytics 4 · Microsoft Clarity · Google Search Console |
| Hosting | Vercel |

---

## Running locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint
```

Node 20 or newer.

---

## Environment variables

Copy `.env.example` to `.env.local`. Nothing here is committed.

| Variable | Required | What it does |
|---|---|---|
| `REACTBITS_LICENSE_KEY` | build only | Authenticates the React Bits Pro registry when installing components. Not needed to run an existing checkout. |
| `RESEND_API_KEY` | yes | Sends contact-form submissions. |
| `LEAD_NOTIFICATION_EMAIL` | yes | Where quote requests are delivered. |
| `RESEND_FROM_EMAIL` | yes | Verified sending address. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | yes | Google Analytics 4 (`G-…`). |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | optional | Microsoft Clarity heatmaps and session recordings. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | optional | Emits the Search Console verification meta tag. |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical origin. Drives `sitemap.xml`, `robots.txt`, canonicals and OG URLs. |

`NEXT_PUBLIC_*` variables are exposed to the browser. That is correct for the two analytics IDs and
the site URL — they are public identifiers by design. Never prefix a secret with `NEXT_PUBLIC_`.

---

## Editing content

**Almost everything lives in one file: [`src/lib/business.ts`](src/lib/business.ts).**

That file is the single source of truth for the phone number, address, licence, rating, opening
hours, and the full service catalogue. Navigation, the footer, `sitemap.xml`, the structured data
and the contact-form dropdown all read from it — so a change there propagates everywhere.

**To change the phone number or address** — edit `BUSINESS`.

**To add, remove or rename a service** — edit the `SERVICES` array. Each entry needs:

```ts
{
  slug: "roofing",              // the URL: /services/roofing
  name: "Roofing",              // display name
  title: "…",                   // <title>, ideally under 60 characters
  description: "…",             // meta description, 140–160 characters
  summary: "…",                 // one line, used on the homepage list
  intro: "…",                   // lead paragraph
  points: [{ title, body }],    // three detail blocks
  hero: "/atmosphere/roof-lines.jpg",
  legacyPath: "/roofing/",      // old WordPress URL, for the redirect
}
```

Removing a service also removes its page, its sitemap entry and its structured data. Add a redirect
in `LEGACY_REDIRECTS` so the old URL still lands somewhere.

**A new service needs a photograph** at `public/work/<slug>.jpg`.

---

## Photography

Two directories, and the distinction matters.

**`public/work/`** — the client's own photography, migrated from the previous site. This is the only
imagery that may appear in any context implying it is their work. It is presented at inset scale
because the source files are 342–1050 px wide.

**`public/atmosphere/`** — licensed Unsplash photography used as full-bleed section grounds.
**It is never captioned, labelled or implied to be a Florida Green project.** Attribution and the
licence are recorded in [`public/atmosphere/CREDITS.json`](public/atmosphere/CREDITS.json).

If higher-resolution originals become available from the client, they belong in `public/work/` and
should replace atmosphere backgrounds wherever the section is about actual work.

---

## Design system

Single committed dark theme — no light mode and no toggle. The palette is "Emerald & Brass": green
is structural, carried by the near-black ground itself rather than by buttons, and brass is the only
accent, used once per screen.

Tokens are defined in [`src/app/globals.css`](src/app/globals.css) and exposed as Tailwind
utilities (`bg-ground`, `text-brass`, `border-line`, …).

| Token | Hex | Contrast on ground | Use |
|---|---|---|---|
| `ground` | `#08130E` | — | Page ground — an emerald black, not a neutral one |
| `raise` | `#0E2119` | — | Cards and raised surfaces |
| `ink` | `#F1EEE4` | 16.30:1 | Primary text |
| `mute` | `#93A199` | 7.03:1 | Secondary text |
| `brass` | `#C6A14A` | 7.75:1 | Primary calls to action. **Once per screen.** |
| `green` | `#4FB88C` | 7.72:1 | Links and eyebrows |
| `green-deep` | `#1E6B4F` | 2.95:1 | **Fills and borders only — never text** |

Every ratio above is measured, and every text pairing meets WCAG AA.

**Type** — Archivo (variable, condensed to `wdth 84`) for display, Newsreader for body, JetBrains
Mono for licence numbers, eyebrows and metrics.

**Motion** — one idea, applied everywhere: content arrives slowly from below, once. The hiding is
gated behind a `.js` class set before first paint, so a visitor without JavaScript sees the whole
page rather than a blank one. `prefers-reduced-motion` disables it entirely.

---

## SEO

- Per-route titles, meta descriptions, canonicals and Open Graph tags
- JSON-LD: `GeneralContractor`, `Service` per page, `AggregateRating`, `BreadcrumbList`
- Generated `sitemap.xml` and `robots.txt`
- Every legacy WordPress URL 301s to its new home via `LEGACY_REDIRECTS`

### Before going live

1. Point `NEXT_PUBLIC_SITE_URL` at the production origin.
2. Verify the Search Console property — the meta tag ships automatically once the site is on the
   domain. Then submit `/sitemap.xml`.
3. Confirm GA4 is receiving events in Realtime.
4. Verify the Resend sending domain and send one live test through `/contact`.
5. Spot-check the redirects: `/roofing`, `/about-us`, `/kitchen` should all 301.

---

## Analytics events

Conversion events fire from [`src/components/analytics.tsx`](src/components/analytics.tsx) via
`track()`:

| Event | Fires when |
|---|---|
| `phone_click` | A phone number is tapped, in the nav or the mobile call bar |
| `form_start` | First keystroke in the quote form |
| `form_submit` | The form submits successfully |
| `quote_request` | A completed quote request, with the selected service |

Mark `quote_request` as a key event in GA4 to report on it as a conversion.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx              root layout, fonts, metadata, analytics
│   ├── page.tsx                homepage
│   ├── about/ · contact/       standalone pages
│   ├── services/[slug]/        one page per service, statically generated
│   ├── api/quote/              contact-form handler (Resend)
│   ├── sitemap.ts · robots.ts  generated at build
│   └── globals.css             design tokens
├── components/
│   ├── site-nav.tsx            header + mobile menu + sticky call bar
│   ├── site-footer.tsx
│   ├── quote-form.tsx
│   ├── reveal.tsx              scroll reveal (no-JS safe)
│   └── analytics.tsx           GA4 + Clarity + track()
└── lib/
    ├── business.ts             ← single source of truth
    ├── schema.tsx              JSON-LD builders
    └── utils.ts
```

---

## Licence

Source code © Switch Case LLC. Site content, brand and the photography in `public/work/` are the
property of Florida Green Improvements, LLC. Photography in `public/atmosphere/` is licensed from
Unsplash — see `CREDITS.json`.
