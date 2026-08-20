/**
 * SINGLE SOURCE OF TRUTH — business facts + service catalogue.
 *
 * Everything downstream reads from here: navigation, routes, sitemap.xml,
 * JSON-LD, footer, and the contact form. Cutting or renaming a service is a
 * one-line edit in this file (see Q-01 in the project log).
 *
 * Facts verified 2026-08-10 against the live site, Google Business Profile,
 * and Florida Sunbiz. Per agreement §1.2 we do not fact-check the client's
 * details — these are carried over as published, not independently confirmed.
 */

export const BUSINESS = {
  name: "Florida Green Improvements",
  legalName: "Florida Green Improvements, LLC",
  tagline: "Unlock the door to your dream home",
  license: "CGC1529180",
  licenseLabel: "Florida Certified General Contractor",

  phone: "(786) 238-1213",
  phoneHref: "tel:+17862381213",
  whatsappHref: "https://wa.me/17862381213",

  address: {
    street: "1590 NE 162nd St, Suite 600",
    locality: "North Miami Beach",
    region: "FL",
    postalCode: "33162",
    country: "US",
  },
  /** Google Business Profile coordinates for North Miami Beach 33162. */
  geo: { latitude: 25.9287, longitude: -80.1637 },

  areaServed: ["Miami-Dade County", "Broward County", "North Miami Beach", "Miami", "Aventura"],

  rating: { value: 5.0, count: 44, source: "Google" },

  social: {
    instagram: "https://www.instagram.com/florida_green_improvements/",
    facebook: "https://www.facebook.com/61559352603753",
  },

  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:00" },
  ],
} as const;

/**
 * Categories follow the wording a homeowner actually uses, not the trade's.
 * "Impact glazing" was cut everywhere at the client's request (revision round
 * 2026-08-13): it is called Impact Windows & Doors.
 *
 * Back to two groups at the 2026-08-19 revision. The third — Storm Protection —
 * held exactly two rows, and the client asked for the standalone Hurricane
 * Protection page to go and for Impact Windows & Doors to sit under Indoor.
 * That emptied the group, so the group went with it. Storm wording survives
 * inside the windows page and the general copy, where it earns its keep as
 * search language without claiming to be a separate thing you can buy.
 */
export type CategoryId = "indoor" | "outdoor";

export type Service = {
  slug: string;
  name: string;
  /** <title> — kept under 60 chars where possible. */
  title: string;
  /** meta description — 140-160 chars. NONE of these existed before. */
  description: string;
  /** Short line used on cards and in nav. */
  summary: string;
  /** Lead paragraph, reformatted from his existing page copy. */
  intro: string;
  points: { title: string; body: string }[];
  /**
   * Full-bleed hero ground. Unsplash atmosphere ONLY — never captioned or
   * implied to be his work. His own photography is 342–1050px wide, which
   * looks soft stretched across a 1440px+ hero, so it appears instead as an
   * inset plate below, at a size where it is genuinely sharp. See IMG-01.
   */
  hero: string;
  /** Inset plate + hover photograph. Defaults to /showcase/<slug>.webp. */
  showcase?: string;
  /**
   * The name as it reads inside "your ___ project" on the service CTA. Only
   * needed where the plural nav label is ungrammatical there — "your pools
   * project". Everything else falls back to `name`.
   */
  ctaName?: string;
  category: CategoryId;
  /** Old WordPress path, for the 301 map. Absent on pages that never existed. */
  legacyPath?: string;
};

/**
 * A group name must be a DIFFERENT KIND OF WORD from the things inside it.
 *
 * The first cut of this failed that test and the client caught it immediately:
 * "Impact Windows & Hurricane Protection" contained *Impact Windows & Doors*
 * and *Hurricane Protection*. The heading was its own children pasted
 * together, so it carried no information, and no amount of type sizing was
 * going to rescue it — a label that says nothing new reads as another list
 * item however you set it.
 *
 * Two words, one line, and a genuine parent term. Every label is short enough
 * that it never wraps, which is what let the type hierarchy be fixed at all.
 */
export const CATEGORIES: {
  id: CategoryId;
  label: string;
  /** Row meta, shown small and tracked. Never longer than the label. */
  short: string;
  anchor: string;
  blurb: string;
}[] = [
  {
    id: "indoor",
    label: "Indoor Renovation",
    short: "Indoor",
    anchor: "indoor",
    blurb:
      "Impact windows and doors, kitchens, bathrooms and whole-home improvement, room by room, under one contract.",
  },
  {
    id: "outdoor",
    label: "Outdoor Renovation",
    short: "Outdoor",
    anchor: "outdoor",
    blurb: "Pools, artificial turf, outdoor kitchens, pergolas and full outdoor living.",
  },
];

/** Where a Service's photograph lives. One place, so the fallback is not repeated. */
export const showcaseSrc = (s: Service) => s.showcase ?? `/showcase/${s.slug}.webp`;

export const SERVICES: Service[] = [
  {
    slug: "windows-and-doors",
    name: "Impact Windows & Doors",
    /**
     * This page absorbed the retired Hurricane Protection page on 2026-08-19.
     * Nothing new was written for it: the storm, utility-bill and noise copy
     * below is that page's own wording, moved rather than invented, so the
     * term a Miami homeowner actually searches for still resolves to a real
     * page instead of a redirect into a list.
     *
     * Three points, not four. The Detail grid is md:grid-cols-3 and a fourth
     * would sit alone on a second row, so the inherited material folds into
     * the intro and into point 03 instead of adding a card.
     */
    title: "Impact Windows & Doors, Hurricane Rated | South Florida",
    description:
      "Hurricane-rated impact windows and doors: energy efficiency, UV protection and year-round security. Financing available. Licensed Miami-Dade contractor.",
    summary: "Hurricane rated, energy efficient, quiet all year.",
    intro:
      "Impact windows and doors do several jobs at once in South Florida: they are engineered to withstand hurricane-force debris and pressure, they cut solar heat gain, they block the UV that fades your interior, and laminated impact glass measurably dampens street and aircraft noise. Living in Florida demands adequate protection for your home — and this is protection that works every day of the year, not only during the season.",
    points: [
      {
        title: "Energy efficiency",
        body: "Impact windows are engineered to minimize solar heat gain during summer and retain warmth inside your home during colder seasons. Reduced heat transfer means the system works less to hold temperature, and the saving continues long after installation.",
      },
      {
        title: "UV protection",
        body: "Impact glass shields your valuables from fading and discoloration caused by prolonged exposure to direct sunlight — especially crucial in Florida, where direct sunlight is prevalent throughout the year.",
      },
      {
        title: "Storm-rated security",
        body: "Impact glass not only withstands hurricanes but offers the highest level of protection to your home and its contents year-round when properly installed.",
      },
    ],
    hero: "/atmosphere/hero-windows-and-doors.webp",
    /**
     * Indoor since 2026-08-19, at the client's request. It sits oddly beside
     * kitchens and bathrooms on paper, but it is the right call for the
     * reader: what a homeowner is buying is the room — the light, the quiet
     * and the bill — and the window is the thing that changes it. The storm
     * rating is on the page; it is no longer the shelf it is sold from.
     */
    category: "indoor",
    legacyPath: "/windows-and-doors/",
  },
  {
    slug: "kitchen",
    name: "Kitchen",
    title: "Kitchen Remodeling in North Miami Beach",
    description:
      "Full kitchen renovation managed end to end — permits, design, materials and build. Design consultation at no additional cost. Licensed contractor CGC1529180.",
    summary: "Managed end to end, from permit to punch list.",
    intro:
      "Our team manages every aspect of your kitchen renovation from start to finish. That includes obtaining permits, securing construction approval and organizing materials before work begins. We build a plan with you that fits your needs and your budget.",
    points: [
      {
        title: "Plan",
        body: "Permits, construction approval and material scheduling handled before anyone starts work — so the timeline you are given is the timeline you get.",
      },
      {
        title: "Design",
        body: "Work alongside our team to design the layout and aesthetics and select materials, fixtures and fittings, at no additional cost. We provide visual aids to help you envision the finished room.",
      },
      {
        title: "Build",
        body: "One licensed general contractor for the whole job, and one point of contact from demolition to final inspection.",
      },
    ],
    hero: "/atmosphere/hero-kitchen.webp",
    category: "indoor",
    legacyPath: "/kitchen/",
  },
  {
    slug: "bathroom",
    name: "Bathroom",
    title: "Bathroom Renovation in Miami-Dade & Broward",
    description:
      "Complete bathroom renovation — fixtures, layout, tiling and plumbing. Free consultation and financing available. Licensed general contractor CGC1529180.",
    summary: "Fixtures, layout, tiling and plumbing in one scope.",
    intro:
      "If you are considering renovating your bathroom, it pays to plan carefully. From choosing the right fixtures and fittings to creating a functional layout, there is a lot to weigh. Whether you are updating an existing bathroom or starting from scratch, our team can help you design a space that fits how you actually use it.",
    points: [
      { title: "Layout", body: "A functional plan drawn around the room you have, not a template dropped into it." },
      { title: "Fixtures & fittings", body: "Selection guided by budget and by what holds up to South Florida humidity." },
      { title: "One trade list", body: "Tiling, plumbing and finishing coordinated under a single contract." },
    ],
    hero: "/atmosphere/hero-bathroom.webp",
    category: "indoor",
    legacyPath: "/bathroom/",
  },
  {
    slug: "remodeling",
    // "Remodeling" was the trade's word for it. The client's own nav calls this
    // Home Improvement, which is also what a homeowner searches for. Slug and
    // legacy redirect are unchanged, so no ranking moves.
    name: "Home Improvement",
    title: "Home Improvement & Interior Remodeling in Miami",
    description:
      "Full interior renovation — kitchens, bathrooms and living spaces — by a licensed Florida general contractor. Rated 5.0 from 44 Google reviews.",
    summary: "Whole-home interior renovation under one contract.",
    intro:
      "Our interior renovation work covers everything from remodeling kitchens and bathrooms to redesigning living spaces. The focus is craftsmanship and finish: interiors that work the way you live and hold their quality years after the job closes.",
    points: [
      {
        title: "Kitchens and bathrooms",
        body: "Renovating your kitchen and bathroom can significantly increase your home's value. Given how much time is spent in these rooms, improving their organization and efficiency pays back twice.",
      },
      { title: "Living spaces", body: "Reconfiguration, finishes and built-ins designed around the existing structure." },
      { title: "One contractor", body: "A single licensed GC carrying the permit, the schedule and the responsibility." },
    ],
    hero: "/atmosphere/hero-remodeling.webp",
    category: "indoor",
    legacyPath: "/remodeling/",
  },
  {
    slug: "pool",
    name: "Pools",
    ctaName: "pool",
    title: "Custom Pool Construction & Design in South Florida",
    description:
      "Custom pool construction built to your site and budget using concrete and premium materials. Licensed general contractor serving Miami-Dade and Broward.",
    summary: "Built to your site and your budget, not a catalogue.",
    intro:
      "We tailor our pool construction and design to your preferences and budget without sacrificing quality or inflating cost. Our team builds custom pools using top-tier materials and modern construction techniques, so the result is durable as well as good-looking. No generic solutions.",
    points: [
      {
        title: "Concrete",
        body: "A durable and versatile material that allows the pool to be shaped to the site rather than the site to the pool.",
      },
      { title: "Custom design", body: "Drawn around your garden, your access and your budget from the first sketch." },
      { title: "Built to last", body: "Premium materials and current construction technique, for longevity in Florida conditions." },
    ],
    hero: "/atmosphere/hero-pool.webp",
    category: "outdoor",
    legacyPath: "/pool/",
  },
  {
    slug: "artificial-turf",
    /**
     * Q-02 CLOSED 2026-08-19. "Artaficial" is misspelled on the client's live
     * site. The <title> and <h1> were corrected in an earlier round; the slug
     * was the last place it survived, and a URL nobody types is a URL that
     * cannot rank for its own keyword. Renamed, with BOTH the WordPress path
     * and the old /services/ URL 301'd below, so nothing that ranks today is
     * thrown away. Reverting means undoing three things, not one: this slug,
     * the two redirect entries, and the two image filenames.
     */
    name: "Artificial Turf",
    title: "Artificial Grass & Turf Installation in South Florida",
    description:
      "Low-maintenance artificial grass installed for yards, roofs, patios and decks. Water-free, safe for kids and pets. Licensed, insured, background-checked installers.",
    summary: "Water-free, low-maintenance, safe for kids and pets.",
    intro:
      "Artificial grass installation involves preparing the area, laying the base and installing the turf — a low-maintenance alternative to natural grass that stays green without water.",
    points: [
      {
        title: "Low maintenance",
        body: "A water-free surface that is safe for children and pets, easy to clean, and works on yards, roofs, patios and decks alike.",
      },
      {
        title: "Trusted installers",
        body: "All our installers are local, licensed and insured. We run background checks on everyone who will enter your home.",
      },
      { title: "Supporting local pros", body: "The crews on your job are local trades, not a subcontracted traveling team." },
    ],
    /**
     * Both photographs replaced 2026-08-19. Same paths, new files: the pair
     * in place before showed a pool ladder and a house elevation with a lawn
     * somewhere in shot, so the page selling grass led with everything except
     * grass. The client asked to see the surface itself, and both frames are
     * now lawn-dominant.
     */
    hero: "/atmosphere/hero-artificial-turf.webp",
    category: "outdoor",
    legacyPath: "/artaficial-turf/",
  },
  {
    /**
     * NEW at the 2026-08-13 revision. The client asked that Outdoor Renovation
     * cover pergolas, outdoor kitchens and full outdoor living — none of which
     * had a page. One page rather than three: there is no page-specific copy
     * from the client for pergolas or outdoor kitchens, and inventing two
     * thin pages would be worse for both the reader and for search.
     *
     * Copy here is deliberately descriptive of scope only. No warranties, no
     * specifications, no pricing — none of that exists in client material.
     *
     * Photography is licensed atmosphere already in the repo (see
     * public/atmosphere/CREDITS.json and public/showcase/CREDITS.json); no new
     * licence was taken for this page.
     */
    slug: "outdoor-living",
    name: "Outdoor Living Renovation",
    title: "Outdoor Kitchens, Pergolas & Outdoor Living | Miami",
    description:
      "Outdoor kitchens, pergolas and full outdoor living renovation for South Florida homes, built by a licensed general contractor. Free estimates, financing available.",
    summary: "Outdoor kitchens, pergolas and full outdoor renovation.",
    intro:
      "An outdoor kitchen, a pergola and the ground between them are one project, not three. We design and build the whole outdoor living space under a single contract, so the paving, the structures, the services and the finishes are planned together and installed by one crew.",
    points: [
      {
        title: "Outdoor kitchens",
        body: "Counter, cooking and storage built into the space, with the plumbing and electrical work planned in from the start rather than added afterwards.",
      },
      {
        title: "Pergolas",
        body: "A shade structure sized and sited for the way you actually use the garden, permitted and built as part of the same job.",
      },
      {
        title: "Full outdoor renovation",
        body: "Pool, turf, paving, planting and structures scoped together — one contractor, one schedule, one point of contact.",
      },
    ],
    /**
     * Photography replaced 2026-08-19. It was borrowing the free-estimate
     * still and the About plate — a house with a pool, and nothing that said
     * *outdoor living* specifically. The client's note was to show the actual
     * facilities: pool, bar, outdoor kitchen. Both images now do, and the page
     * has its own showcase plate rather than sharing About's.
     */
    hero: "/atmosphere/hero-outdoor-living.webp",
    category: "outdoor",
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const servicesByCategory = (id: CategoryId) => SERVICES.filter((s) => s.category === id);

/** Nav is intentionally short — The Vault withholds. Full list lives in the footer. */
export const PRIMARY_NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/* ══ REVISION-ROUND CONTENT · 2026-08-13 ═══════════════════════════════
   Everything below was requested by the client in the first revision round.

   SOURCING RULE, and it is not optional: every factual claim here is either
   (a) lifted from the client's own live site — the crawl is in baseline/crawl
   — or (b) a description of scope that carries no promise. Nothing about
   warranties, interest rates, approval odds, terms, tax or government
   programmes has been written that the client did not already publish. See
   the open questions at the end of this file.                            */

/**
 * The four things a visitor is here to buy, in the client's own words. Used by
 * the lead popup and by the "what do you need?" select on the quote form.
 * `service` matches a SERVICES name so the form's own validation accepts it.
 */
export const RENOVATION_CATEGORIES = [
  { label: "Kitchen", service: "Kitchen", href: "/services/kitchen" },
  { label: "Bathroom", service: "Bathroom", href: "/services/bathroom" },
  {
    label: "Outdoor Living Space",
    service: "Outdoor Living Renovation",
    href: "/services/outdoor-living",
  },
  {
    label: "Impact Windows & Doors",
    service: "Impact Windows & Doors",
    href: "/services/windows-and-doors",
  },
];

/**
 * Why Choose Us. Four of these six are the client's own "Why Choose Us" block,
 * carried over near-verbatim from /about-us and the homepage. The two that are
 * not — Lower Utility Bills and Home Value — are the client's homepage
 * "Why you should go florida green improvements?" cards, edited only to drop
 * the retired services (AC, roofing) they originally named.
 */
export const WHY_CHOOSE_US = [
  {
    title: "Professional expertise",
    body: "Our technicians bring years of experience and the best equipment in the industry, on every installation.",
  },
  {
    title: "Best quality materials",
    body: "All of our materials are of the highest standard, providing the protection your home needs as well as saving on your energy costs.",
  },
  {
    title: "Customer satisfaction",
    body: "We guarantee our work and strive to ensure our clients' happiness, with clear communication and reliable service from first call to final inspection.",
  },
  {
    title: "Affordable solutions",
    body: "We work with any budget, no matter how small. Financing is available and we offer our services with no money down.",
  },
  {
    title: "Lower utility bills",
    body: "Impact windows and doors reduce heat transfer, so the system works less to hold temperature — and the saving continues long after installation.",
  },
  {
    title: "More value in the home",
    body: "Homes with updated kitchens and impact-resistant features hold a higher market value and find buyers more quickly in the Florida market.",
  },
];

/**
 * Financing. The client's /finance page is the only source here.
 *
 * DELIBERATELY OMITTED, and do not add them back without written confirmation:
 * the "up to 30 years", "fixed rates", "low interest rates regardless of credit
 * score" comparison table, and the PACE programme named in step 2 of the old
 * three-step process. Those are specific financial and government-programme
 * claims; the revision brief forbids publishing them unless the client
 * confirms them in writing. See Q-04 below.
 */
export const FINANCING = {
  eyebrow: "Financing",
  heading: "Financing available. $0 down options available.",
  intro:
    "To maintain, repair or renovate your home, you can secure a home improvement loan. There are several funding options and each is worth weighing properly. Talk to us and we will arrange for someone to walk you through the options and find the best approach for your project.",
  cards: [
    {
      title: "$0 down options",
      body: "We cater to all budgets, regardless of size, and offer our services without requiring any upfront payment.",
    },
    {
      title: "Flexible financing",
      body: "Financing arranged around your project, so the work can start without upfront strain on your household budget.",
    },
    {
      title: "Straightforward approval",
      body: "Swift, seamless processing designed to stay accessible whatever your credit history.",
    },
  ],
  /** Eligibility is not ours to promise. This line stays wherever terms appear. */
  disclaimer:
    "Financing and $0 down options are subject to approval and to the terms of the finance provider. Ask us and we will confirm what is available for your project.",
};

/**
 * FAQ. Adapted from the client's own homepage FAQ. The service list in Q1 was
 * rewritten to match what the company actually sells today — the original
 * named solar and HVAC, which were retired. Nothing legal, financial,
 * insurance, tax or eligibility-related has been answered beyond what the
 * client already published.
 */
export const FAQS = [
  {
    q: "What services does Florida Green Improvements offer?",
    a: "We cover hurricane-rated impact windows and doors, kitchen remodeling, bathroom remodeling, whole-home improvement, and outdoor renovation — pools, artificial turf, outdoor kitchens and pergolas.",
  },
  {
    q: "Are your contractors licensed and insured?",
    a: `Yes. We are fully licensed (${BUSINESS.license}) and insured. Our team is made up of seasoned professionals with years of specific industry expertise, and every installer who will enter your home is background-checked.`,
  },
  {
    q: "How long does a typical project take from start to finish?",
    a: "It depends on the complexity and the scope. We work to complete projects efficiently while holding the quality of the workmanship, and we give you a timeline estimate during the consultation.",
  },
  {
    q: "Do you charge for an estimate or a design consultation?",
    a: "No. Estimates are free and carry no obligation, and design consultation — layout, materials, fixtures and finishes, with visual aids so you can see the room before it is built — is included at no additional cost.",
  },
  {
    q: "Do you offer financing?",
    a: "Yes. Financing is available and $0 down options are available. Contact us and we will arrange for someone to talk through the financing options and help you decide which suits your project. Approval and terms are set by the finance provider.",
  },
  {
    q: "Which areas do you serve?",
    a: `We work across ${BUSINESS.areaServed.slice(0, 2).join(" and ")}, including ${BUSINESS.address.locality}, Miami and Aventura.`,
  },
  {
    q: "Are your products environmentally friendly?",
    a: "We prioritize sustainability and environmental responsibility when we select products. Energy-efficient windows and doors and the materials we specify for remodeling are chosen to reduce environmental impact as well as to last.",
  },
];

/**
 * Google reviews. VERBATIM, captured from the Google Business Profile on
 * 2026-08-13 (5.0 from 44 reviews, profile CID 2743427625117483435).
 *
 * DO NOT EDIT THE TEXT. Where a review is longer than what Google serves in
 * its collapsed card, `truncated: true` marks it and the component appends a
 * "…" plus a link to the full review on Google. Rewriting, tidying or
 * completing a customer's words is fabrication, and it is also the fastest way
 * to get a review-rich-result penalty.
 *
 * To refresh: open the profile, copy the text exactly, and update `capturedOn`.
 */
export const GOOGLE_REVIEWS_URL = "https://www.google.com/maps?cid=2743427625117483435";

export const GOOGLE_REVIEWS = {
  capturedOn: "2026-08-13",
  items: [
    {
      author: "Ofir Hershkovitz",
      rating: 5,
      truncated: true,
      body: "Florida Green Improvements did an amazing job renovating our kitchen and bathroom. The results are absolutely stunning! The entire process was extremely clean, no dust or mess, exactly as promised.",
    },
    {
      author: "Daniel Arie",
      rating: 5,
      truncated: true,
      body: "I had an amazing experience with this company remodeling my kitchen. The whole process was smooth, professional, and completed on time. The quality of the work exceeded my expectations and the attention to detail was impressive.",
    },
    {
      author: "Tal Nemzer",
      rating: 5,
      truncated: false,
      body: "Amazing experience from start to finish. The team was professional, honest, responsive, and delivered outstanding quality work. Everything was done on time with great attention to detail, and the entire process was smooth and stress-free. You can tell they truly care about their clients and take pride in their work. Highly recommend!",
    },
  ],
};

/**
 * 301 map — every legacy WordPress URL must land somewhere on the new site or
 * the rankings that exist today are thrown away at cutover.
 */
export const LEGACY_REDIRECTS: { from: string; to: string }[] = [
  { from: "/about-us", to: "/about" },
  /* Was /contact. There is a financing section now, so the page that used to
     rank for "florida green finance" lands on the thing it was about. */
  { from: "/finance", to: "/#financing" },
  /**
   * Roofing, air conditioning and solar were retired at the client's request.
   * Those pages carry whatever ranking the old site earned, so they must land
   * somewhere real rather than 404 — the service list is the honest
   * destination. Both the WordPress paths and the short-lived /services/ URLs
   * are covered, since the review copy was shared before the cut.
   */
  { from: "/roofing", to: "/#services" },
  { from: "/air-conditioning", to: "/#services" },
  { from: "/solar-panels", to: "/#services" },
  { from: "/services/roofing", to: "/#services" },
  { from: "/services/air-conditioning", to: "/#services" },
  { from: "/services/solar-panels", to: "/#services" },
  /**
   * Retired 2026-08-19. These two are NOT the roofing case — they are not
   * dead scope, they are scope that moved, so neither lands on the services
   * list. Hurricane Protection went to Impact Windows & Doors, which now
   * carries its copy verbatim; Landscape went to Outdoor Living Renovation,
   * whose scope already covers turf, paving, planting and structures. Both
   * the WordPress paths and the /services/ URLs are covered, because the
   * /services/ ones were live on the new build before the cut.
   */
  { from: "/impact-window-hurricane-protection", to: "/services/windows-and-doors" },
  { from: "/services/impact-window-hurricane-protection", to: "/services/windows-and-doors" },
  { from: "/landscape", to: "/services/outdoor-living" },
  { from: "/services/landscape", to: "/services/outdoor-living" },
  /**
   * Q-02, closed 2026-08-19: the turf slug lost its misspelling. `legacyPath`
   * on the service still reads "/artaficial-turf/" — that is the client's real
   * WordPress URL and it MUST keep the typo, because it is the thing being
   * redirected FROM. It is auto-mapped by the spread below, which now sends it
   * to the corrected slug. Only the /services/ form needs adding by hand: it
   * was live on the new build under the old spelling before the rename.
   */
  { from: "/services/artaficial-turf", to: "/services/artificial-turf" },
  ...SERVICES.filter((s) => s.legacyPath).map((s) => ({
    from: s.legacyPath!.replace(/\/$/, ""),
    to: `/services/${s.slug}`,
  })),
];

/* ── OPEN QUESTIONS FOR THE CLIENT ────────────────────────────────────
   Q-04  Financing detail. His /finance page published "up to 30 years",
         "fixed rates", "low interest rates regardless of credit score",
         "approval not based on credit score", and named PACE financing in
         its three-step process. None of that is on the new site: they are
         specific financial and government-programme claims and we cannot
         verify them. If he confirms which are current and correct, they can
         go back into FINANCING above.
   Q-05  "We guarantee our work" is his own wording and is used as-is under
         Customer satisfaction. No warranty LENGTH is stated anywhere,
         because none was ever published. If a warranty exists, we need the
         actual terms before it goes on the site.
   Q-06  Google review text. Two of the three reviews are longer than the
         card Google serves; they are shown as exact excerpts marked with an
         ellipsis and linked to the full review. If he can export the full
         text from his Business Profile we can show them complete.        */
