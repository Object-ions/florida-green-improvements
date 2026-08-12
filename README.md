# Florida Green Improvements

Website for [Florida Green Improvements](https://www.floridagreenimprovements.com) — a licensed
Florida general contractor (CGC1529180) in North Miami Beach, working across impact glazing,
interior renovation and outdoor living in Miami-Dade and Broward.

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
| Hosting | Netlify |

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
| `NEXT_PUBLIC_INDEXABLE` | **yes at launch** | `"true"` allows search engines to index the site. Any other value emits `noindex, nofollow`. Deliberately `"false"` on the review copy so Google cannot index a duplicate competing with the client's live site. **Set it to `"true"` at DNS cutover or the site will never rank.** |

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
  slug: "kitchen",              // the URL: /services/kitchen
  name: "Kitchen",              // display name
  title: "…",                   // <title>, ideally under 60 characters
  description: "…",             // meta description, 140–160 characters
  summary: "…",                 // one line, used on the homepage list
  intro: "…",                   // lead paragraph
  points: [{ title, body }],    // three detail blocks
  hero: "/atmosphere/glass-facade.jpg",
  category: "indoor",           // "indoor" | "outdoor" — drives the homepage grouping
  legacyPath: "/kitchen/",      // old WordPress URL, for the redirect
}
```

Removing a service also removes its page, its sitemap entry and its structured data. Add a redirect
in `LEGACY_REDIRECTS` so the old URL still lands somewhere.

**A new service needs a photograph** at `public/showcase/<slug>.jpg`, and a `category` so it
appears under Indoor or Outdoor on the homepage.

**Retiring a service** means deleting its entry *and* adding a redirect in `LEGACY_REDIRECTS` for
both its old WordPress path and its `/services/<slug>` URL — otherwise whatever ranking that page
earned turns into a 404. Also check `SHOWCASE` in `contact-block.tsx`, which lists services
independently.

---

## Photography

**Every image on this site is licensed stock. None of it is client project work**, at the client's
own request. That constraint is deliberate and load-bearing:

> **No image may be captioned, labelled, alt-tagged or otherwise implied to be a completed
> Florida Green Improvements project.**

Alt text on showcase imagery is intentionally empty (`alt=""`) because the images are decorative
rather than informational — describing them would imply provenance the business cannot claim.
Carousel labels name the **service**, never a project.

| Directory | Role |
|---|---|
| `public/showcase/` | Aspirational photography, one per service plus the About hero |
| `public/atmosphere/` | Full-bleed section grounds — heroes, textures, CTA backdrops |

Attribution and licence terms are recorded in each directory's `CREDITS.json`.

If the client later supplies his own project photography, it should go in a new `public/work/`
directory, and only then may an image carry a caption or alt text describing it as their work.

---

## Design system

Single committed light theme — no dark mode and no toggle.

The palette is taken from the client's own stationery, sampled rather than guessed: white,
charcoal `#383838` and amber `#F8B858`. Green appears only in the logo wordmark, so it is a
secondary here rather than the lead. Amber is used once per screen and never for text.

Tokens are defined in [`src/app/globals.css`](src/app/globals.css) and exposed as Tailwind
utilities (`bg-ground`, `text-brass`, `border-line`, …).

| Token | Hex | Contrast on ground | Use |
|---|---|---|---|
| `ground` | `#FAFAF8` | — | Page ground |
| `raise` | `#FFFFFF` | — | Cards, panels, form fields |
| `sink` | `#F0F0EC` | — | Footer and recessed areas |
| `ink` | `#383838` | 11.22:1 | Primary text — the brand charcoal, exactly |
| `ink-2` | `#575757` | 6.91:1 | Secondary text |
| `mute` | `#696969` | 5.25:1 | Tertiary text. Chosen to clear AA on ground **and** on the darker footer surface — `#6E6E6E` passed on ground but failed at 4.46:1 on `sink`. |
| `amber` | `#F8B858` | 1.68:1 | **Fill only — cannot carry text.** The stationery accent, once per screen. |
| `amber-text` | `#8A6212` | 5.24:1 | Amber when it must be text, e.g. hover states |
| `on-amber` | `#383838` | 6.69:1 on amber | Text sitting on an amber fill |
| `green` | `#457F28` | 4.65:1 | Links and eyebrows — from the logo wordmark |
| `green-deep` | `#3D7223` | 5.54:1 | Fills and borders |
| `line` | `#E4E4E0` | — | Decorative hairlines |
| `field` | `#8E8E88` | 3.15:1 | Form borders. Fields are UI controls and need 3:1; hairlines do not. |

Every ratio above is measured, and every text pairing meets WCAG AA.

**Type** — two widths of one superfamily. Archivo condensed to `wdth 84` for display, Archivo at
normal width for labels, eyebrows and metrics, and Newsreader for body copy. A tracked monospace
was tried for the utility role and abandoned: at 10px and 0.28em it was unreadable.

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

1. **Set `NEXT_PUBLIC_INDEXABLE` to `"true"`.** Until this is done every page emits
   `noindex, nofollow` and the site cannot rank. This is the single easiest launch step to forget
   and the most damaging to miss.
2. Point `NEXT_PUBLIC_SITE_URL` at the production origin.
3. Point `LEAD_NOTIFICATION_EMAIL` at the client. On preview contexts it deliberately routes
   elsewhere so test submissions never reach them.
4. Verify the client's sending domain with Resend and update `RESEND_FROM_EMAIL`.
5. Verify the Search Console property — the meta tag ships automatically once the site is on the
   domain. Then submit `/sitemap.xml`.
6. Confirm GA4 is receiving events in Realtime.
7. Send one live test through `/contact`.
8. Spot-check the redirects: `/roofing`, `/about-us`, `/kitchen` should all 301.

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
│   ├── ui/
│   │   └── cinematic-list.tsx  expanding hover list used for the services grid
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
