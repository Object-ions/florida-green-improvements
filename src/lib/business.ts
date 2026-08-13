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
  /** Indoor work happens inside the house; outdoor is the envelope and the grounds. */
  category: "indoor" | "outdoor";
  /** Old WordPress path, for the 301 map. */
  legacyPath: string;
};

export const CATEGORIES = [
  { id: "indoor" as const, label: "Indoor", blurb: "Interior renovation, room by room." },
  { id: "outdoor" as const, label: "Outdoor", blurb: "The envelope, the grounds and everything the season tests." },
];

export const SERVICES: Service[] = [
  {
    slug: "impact-window-hurricane-protection",
    name: "Impact Windows & Hurricane Protection",
    title: "Impact Windows & Hurricane Protection | Miami-Dade",
    description:
      "Premium impact windows for South Florida homes. Storm protection, lower utility bills and noise reduction. Licensed contractor CGC1529180, free estimates.",
    summary: "Storm-rated glazing that also cuts your bills.",
    intro:
      "Premium impact windows offer increased protection against severe weather such as hurricanes and storms, while improving energy efficiency by reducing heat transfer. Living in Florida demands adequate protection for your home. Your home is not just a building — it is a sanctuary. Keeping your family safe is our top priority, just as it is yours.",
    points: [
      {
        title: "Storm protection",
        body: "Engineered to withstand hurricane-force debris impact and pressure, protecting the structure and everything inside it.",
      },
      {
        title: "Lower utility bills",
        body: "Reduced heat transfer means the system works less to hold temperature — the saving continues long after installation.",
      },
      {
        title: "Noise reduction",
        body: "Laminated impact glass measurably dampens street and aircraft noise, which matters in dense Miami-Dade neighbourhoods.",
      },
    ],
    hero: "/atmosphere/windows-hero.jpg",
    category: "outdoor",
    legacyPath: "/impact-window-hurricane-protection/",
  },
  {
    slug: "windows-and-doors",
    name: "Windows & Doors",
    title: "Impact Window & Door Installation in South Florida",
    description:
      "Energy-efficient impact windows and doors with UV protection and year-round security. Financing available. Licensed contractor serving Miami-Dade and Broward.",
    summary: "Energy efficiency, UV protection, year-round security.",
    intro:
      "Impact windows and doors do three jobs at once in South Florida: they cut solar heat gain, they block the UV that fades your interior, and they protect the house every day of the year — not only during the season.",
    points: [
      {
        title: "Energy efficiency",
        body: "Impact windows are engineered to minimise solar heat gain during summer and retain warmth inside your home during colder seasons.",
      },
      {
        title: "UV protection",
        body: "Impact glass shields your valuables from fading and discoloration caused by prolonged exposure to direct sunlight — especially crucial in Florida, where direct sunlight is prevalent throughout the year.",
      },
      {
        title: "Security all year",
        body: "Impact glass not only withstands hurricanes but offers the highest level of protection to your home and its contents year-round when properly installed.",
      },
    ],
    hero: "/atmosphere/windows-hero.jpg",
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
      "Our team manages every aspect of your kitchen renovation from start to finish. That includes obtaining permits, securing construction approval and organising materials before work begins. We build a plan with you that fits your needs and your budget.",
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
    hero: "/atmosphere/interior-dark.jpg",
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
    hero: "/atmosphere/interior-dark.jpg",
    category: "indoor",
    legacyPath: "/bathroom/",
  },
  {
    slug: "remodeling",
    name: "Remodeling",
    title: "Home Remodeling & Interior Renovation in Miami",
    description:
      "Full interior renovation — kitchens, bathrooms and living spaces — by a licensed Florida general contractor. Rated 5.0 from 44 Google reviews.",
    summary: "Whole-home interior renovation under one contract.",
    intro:
      "Our interior renovation work covers everything from remodeling kitchens and bathrooms to redesigning living spaces. The focus is craftsmanship and finish: interiors that work the way you live and hold their quality years after the job closes.",
    points: [
      {
        title: "Kitchens and bathrooms",
        body: "Renovating your kitchen and bathroom can significantly increase your home's value. Given how much time is spent in these rooms, improving their organisation and efficiency pays back twice.",
      },
      { title: "Living spaces", body: "Reconfiguration, finishes and built-ins designed around the existing structure." },
      { title: "One contractor", body: "A single licensed GC carrying the permit, the schedule and the responsibility." },
    ],
    hero: "/atmosphere/interior-dark.jpg",
    category: "indoor",
    legacyPath: "/remodeling/",
  },
  {
    slug: "pool",
    name: "Pool",
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
    hero: "/atmosphere/pool-dusk.jpg",
    category: "outdoor",
    legacyPath: "/pool/",
  },
  {
    slug: "landscape",
    name: "Landscape",
    title: "Landscape Maintenance Services in South Florida",
    description:
      "Lawn care, weed control, pruning and seasonal cleanups that keep your outdoor space maintained year-round. Serving Miami-Dade and Broward County.",
    summary: "Lawn care, weed control, pruning, seasonal cleanups.",
    intro:
      "Our landscape maintenance keeps your outdoor space looking right through the whole year. Whether you need regular lawn care, seasonal cleanups or something more specialised, we have the team and the equipment for it.",
    points: [
      { title: "Lawn mowing", body: "Grass kept trimmed to the correct height for a neat, consistent appearance." },
      { title: "Weed control", body: "Safe and effective methods to keep weeds from taking over the planting." },
      {
        title: "Pruning and trimming",
        body: "Trees, shrubs and bushes pruned to promote healthy growth and hold their shape.",
      },
    ],
    hero: "/atmosphere/palm-shadow.jpg",
    category: "outdoor",
    legacyPath: "/landscape/",
  },
  {
    slug: "artaficial-turf",
    // ⚠️ Q-02 — "Artaficial" is misspelled on the live site, in the URL, the
    // <title> and the <h1>. Slug retained pending Shay's sign-off. To fix:
    // change slug to "artificial-turf" and add the old path to the redirect map.
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
      { title: "Supporting local pros", body: "The crews on your job are local trades, not a subcontracted travelling team." },
    ],
    hero: "/atmosphere/palm-shadow.jpg",
    category: "outdoor",
    legacyPath: "/artaficial-turf/",
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const servicesByCategory = (id: "indoor" | "outdoor") =>
  SERVICES.filter((s) => s.category === id);

/** Nav is intentionally short — The Vault withholds. Full list lives in the footer. */
export const PRIMARY_NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * 301 map — every legacy WordPress URL must land somewhere on the new site or
 * the rankings that exist today are thrown away at cutover.
 */
export const LEGACY_REDIRECTS: { from: string; to: string }[] = [
  { from: "/about-us", to: "/about" },
  { from: "/finance", to: "/contact" },
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
  ...SERVICES.map((s) => ({ from: s.legacyPath.replace(/\/$/, ""), to: `/services/${s.slug}` })),
];
