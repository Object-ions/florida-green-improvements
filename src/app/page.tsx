import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { SiteNav, CallBar } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { ContactBlock } from "@/components/contact-block";
import { CinematicList } from "@/components/ui/cinematic-list";
import { HeroVideo, type HeroSource } from "@/components/hero-video";
import { GoogleReviews } from "@/components/google-reviews";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Financing } from "@/components/financing";
import { Faq } from "@/components/faq";
import { QuotePopup } from "@/components/quote-popup";
import { BUSINESS, SERVICES, CATEGORIES, servicesByCategory, showcaseSrc } from "@/lib/business";
import { businessSchema, faqSchema, JsonLd } from "@/lib/schema";

/* ── THE VAULT ────────────────────────────────────────────────────────
   Photography is the ground of every section. Type sits small and wide
   over it, never bold. Brass appears once per screen and nowhere else. */

/* ── HERO MEDIA ───────────────────────────────────────────────────────
   HERO_POSTER is the fallback and the LCP element — always rendered.

   HERO_VIDEO is a slow cinematic push rendered from that same licensed
   photograph — a 12s loop whose zoom curve is a sine, so it returns to
   exactly its first frame and the loop point is invisible. It is derived
   from the still rather than sourced separately because no stock-video
   provider is reachable without an API key, and it clears IMG-01 for free:
   the licence, the subject and the attribution are all unchanged.

   Set HERO_VIDEO to null to fall back to the photograph alone. Swapping in
   real footage later is a one-line change here.

   Whatever goes here must clear IMG-01: atmosphere only, never captioned
   or implied to be a Florida Green project. */
const HERO_POSTER = "/atmosphere/hero-luxury.webp";
const HERO_VIDEO: HeroSource[] | null = [
  { src: "/atmosphere/hero-v2.webm", type: "video/webm" },
  { src: "/atmosphere/hero-v2.mp4", type: "video/mp4" },
];

/* Imagery here is illustrative of the stage, never of a Florida Green project.
   Deliberately no people and no third-party branding: a photograph of a crew
   sitting under "How it works" reads as *his* crew, which is exactly the claim
   the licensing note in public/process/CREDITS.json forbids. */
const PROCESS = [
  {
    n: "01",
    title: "Plan",
    img: "/process/plan.webp",
    body: "Permits, construction approval and material scheduling are handled before anyone starts work — so the timeline you are given is the timeline you get.",
  },
  {
    n: "02",
    title: "Design",
    img: "/process/design.webp",
    body: "We work through layout, materials, fixtures and finishes with you, with visual aids so you can see the room before it is built. At no additional cost.",
  },
  {
    n: "03",
    title: "Build",
    img: "/process/build.webp",
    body: "One licensed general contractor carries the permit, the schedule and the responsibility from demolition through final inspection.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd data={businessSchema()} />
      <JsonLd data={faqSchema()} />
      <SiteNav />

      <main id="main">
        {/* ── HERO ───────────────────────────────────────────────────────
             Full bleed, type over the media, LIGHT overlay, charcoal type.

             Worth reading the history before changing this again — all four
             possible designs have now been built and measured:

             1. Full bleed + CHARCOAL type + white veil. Measured as low as
                1.0:1 across five breakpoints. Raising the veil enough to fix
                it turned the picture milky, and that was rejected.
             2. Split — type beside the picture, no overlay. Measured clean,
                but the client wanted the picture full bleed.
             3. Full bleed + WHITE type + dark overlay. Measured clean, but
                the client did not want a dark hero.
             4. Full bleed + charcoal type + a LIGHT overlay. This one.

             What made 4 possible was not a better gradient — it was picking
             a photograph whose bright region is where the words go, and then
             putting the words there. Twenty-one candidates were scored by the
             veil alpha each needs for charcoal type to clear 4.5:1; this one
             needs .02 against the .57-.65 every other candidate wanted.

             Before changing the photograph, score the replacement the same
             way. A hero image here is a legibility decision first. */}
        <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-ground">
          <div className="absolute inset-0">
            {/* The fallback, and the LCP element. Always rendered, always
                painted first; the video layers on top of it. */}
            <Image
              src={HERO_POSTER}
              alt=""
              fill
              priority
              sizes="100vw"
              quality={78}
              className="object-cover"
            />
            {HERO_VIDEO ? <HeroVideo sources={HERO_VIDEO} /> : null}

            {/* A CENTRED light scrim, not a full-frame wash — and that
                distinction is the whole design.

                The type is centred now, so it sits on the subject: measured
                across 43 candidate photographs, charcoal type in the middle of
                any luxury house shot needs a .52–.64 veil, because a dark
                window, doorway or shadow always lands under it. This one needs
                .61 (centre p5 21 desktop, 17 mobile -> composite must reach
                rgb 160).

                A flat .61 over the whole frame is the grey fog that was
                rejected. An ellipse that reaches .78 behind the words and is
                gone by 80% of the radius costs the same contrast but leaves
                the pool, the lawn, the roofline and the sky at full strength,
                so it reads as light falling on the picture rather than fog
                over it. */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_86%_76%_at_50%_50%,rgba(250,250,248,.15)_0%,rgba(250,250,248,.13)_50%,rgba(250,250,248,.08)_78%,transparent_96%)]" />
          </div>

          {/* Centred on both axes, per the client. The copy sits on a frosted
              glass panel rather than on a full-frame wash: the veil the type
              needs is confined to a ~760px card, so the photograph outside it
              stays at the 15% the client asked for and the words still have a
              floor. backdrop-blur does most of the work — blurring the
              backdrop collapses the local extremes that were measuring 1.1:1,
              before any tint is applied at all. */}
          <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-6 py-24 text-center md:px-10">
            <div className="hero-glass">
              <p className="u-data mb-6 text-ink">
                <span className="text-ink" aria-hidden>&#9679;</span>{" "}
                {BUSINESS.address.locality}, Florida &middot; License {BUSINESS.license}
              </p>

              <h1 className="mx-auto max-w-[15ch] text-[clamp(2.25rem,6vw,4.5rem)] text-ink">
                {BUSINESS.tagline}
              </h1>

              <p className="mx-auto mt-7 max-w-[46ch] text-[17px] leading-relaxed text-ink md:text-[19px]">
                Impact windows, kitchens and full remodels for South Florida homes that have to
                survive the season and still look like this.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link href="/contact" className="btn btn-amber">
                  Request a quote
                </Link>
                <a href={BUSINESS.phoneHref} className="btn btn-ghost btn-tel bg-ground/70 backdrop-blur-[3px]">
                  {BUSINESS.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[1400px] border-t border-line/50 bg-ground/85 px-6 py-6 backdrop-blur-[2px] md:px-10">
            <ul className="flex flex-wrap items-center gap-x-10 gap-y-3">
              <li className="flex items-center gap-2 font-data text-[12px] uppercase tracking-[0.1em] text-ink-2">
                <Star size={12} strokeWidth={0} fill="currentColor" className="text-brand-yellow" aria-hidden />
                {BUSINESS.rating.value.toFixed(1)} · {BUSINESS.rating.count} Google reviews
              </li>
              <li className="font-data text-[12px] uppercase tracking-[0.1em] text-ink-2">
                Licensed &amp; insured
              </li>
              <li className="font-data text-[12px] uppercase tracking-[0.1em] text-ink-2">
                Miami-Dade &amp; Broward
              </li>
            </ul>
          </div>
        </section>

        {/* ── STATEMENT ────────────────────────────────────────────
             Asymmetric padding on purpose. `py-40` put 160px below this
             section and Services put another 128px above itself, so the two
             stacked to 288px of nothing between the paragraph and the service
             list — half a laptop screen. The gap into a section is the sum of
             both sides, and only one of them can afford to be generous.
             Top keeps its air; bottom pays for the join. */}
        <section className="mx-auto max-w-[1400px] px-6 pt-28 pb-20 md:px-10 md:pt-40 md:pb-20">
          <div className="grid gap-14 md:grid-cols-[132px_1fr]">
            <Reveal>
              <p className="u-data md:pt-3">About</p>
            </Reveal>

            <div className="grid gap-12 lg:grid-cols-[1fr_minmax(260px,400px)] lg:items-center lg:gap-16">
              <Reveal delay={120}>
                <h2 className="max-w-[24ch] text-[clamp(1.75rem,4vw,3.25rem)] font-display uppercase leading-[0.98] text-ink">
                  One contractor for the whole job.
                </h2>
                {/* "Impact glazing" was here until Aug 13. The client's note
                    was that he did not understand the phrase, and he is the
                    person it was supposed to sell to. Homeowner wording now,
                    everywhere: impact windows and doors. Hurricane protection
                    stopped being a separate item in this list on Aug 19, when
                    the standalone page was retired — it is now what the
                    windows ARE, which is also how it is sold. */}
                <p className="mt-10 max-w-[62ch] text-[17px] leading-relaxed text-mute md:text-[18px]">
                  Florida Green Improvements is a licensed general contractor working across
                  hurricane-rated impact windows and doors, kitchen and bathroom remodeling, and
                  outdoor renovation. One permit, one schedule, one point of contact — from the
                  first drawing to the final inspection.
                </p>
                {/* Ghost rather than amber on purpose: the brass fill is the
                    page's one loud CTA and it already appears in the hero and
                    the closing block. A third would flatten all three. */}
                <div className="mt-10">
                  <Link href="/about" className="btn btn-ghost">
                    About the company
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={240}>
                <div className="relative aspect-[4/5] overflow-hidden surface">
                  <Image
                    src="/atmosphere/statement-luxury.webp"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    quality={72}
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── SERVICES, split indoor / outdoor ──────────────────── */}
        <section id="services" className="border-t border-line">
          {/* 80px in, 80px out of the section above it: 160px total across the
              rule, which is the spacing this page uses between major sections
              everywhere else. It was 288. */}
          <div className="mx-auto max-w-[1400px] px-6 pt-16 md:px-10 md:pt-20">
            <Reveal>
              <h2 className="u-data">Services · {SERVICES.length}</h2>
            </Reveal>
          </div>

          {/* Each category carries its own id so the nav dropdown, the mobile
              menu and any future campaign link can land on the right group
              rather than dumping the visitor at the top of the list.
              `scroll-mt` clears the fixed header. */}
          <div id="work" className="mx-auto max-w-[1400px] px-6 pb-16 md:px-10 md:pb-16">
            {/* Group-to-group was mt-28 — 112px, wider than the gap between
                some whole sections, so the three groups read as three separate
                sections rather than three parts of one list. 64px is enough to
                say "new group" and little enough to say "same section". */}
            {CATEGORIES.map((cat, ci) => (
              <div
                key={cat.id}
                id={cat.anchor}
                className={`scroll-mt-28 ${ci ? "mt-14 md:mt-16" : "mt-10"}`}
              >
                {/* The group label is an EYEBROW, not a heading at row scale.
                    It was set at clamp(...,2.75rem) directly above rows set at
                    clamp(...,2.75rem) — identical size, identical case,
                    identical weight — so the group and its contents read as one
                    flat list. The client's note was "order and hierarchy here
                    is very not clear", and he was right.

                    Small tracked label over large condensed content is the
                    pattern this site already uses everywhere else: About,
                    Overview, Detail, How it works, Free estimates. This section
                    was the one place that broke it. The rows keep their scale —
                    they are the thing being chosen, so they stay the big type.

                    Stacked left rather than label-left / blurb-right: at 1400px
                    a small label and a blurb pinned to opposite edges read as
                    two unrelated fragments. */}
                <Reveal>
                  <div className="pb-6">
                    <h3 className="u-data text-ink">{cat.label}</h3>
                    <p className="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-mute md:text-[16px]">
                      {cat.blurb}
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={120}>
                  <CinematicList
                    items={servicesByCategory(cat.id).map((s, i) => ({
                      id: String(i + 1).padStart(2, "0"),
                      title: s.name,
                      meta: cat.short,
                      href: `/services/${s.slug}`,
                      src: showcaseSrc(s),
                    }))}
                  />
                </Reveal>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROCESS, over photography ──────────────────────────── */}
        <section className="relative overflow-hidden border-t border-line/40">
          <div className="absolute inset-0">
            <Image
              src="/atmosphere/roof-lines.webp"
              alt=""
              fill
              sizes="100vw"
              quality={55}
              className="object-cover opacity-[0.28] [filter:saturate(.9)]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--fg-ground)_0%,rgba(250,250,248,.86)_45%,var(--fg-ground)_100%)]" />
          </div>

          <div className="relative mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-24">
            <Reveal>
              <h2 className="u-data mb-10">How it works</h2>
            </Reveal>
            <div className="grid gap-14 md:grid-cols-3 md:gap-12">
              {PROCESS.map((step, i) => (
                <Reveal key={step.n} delay={i * 140}>
                  <div className="group">
                    <div className="relative mb-8 aspect-[4/3] overflow-hidden surface">
                      <Image
                        src={step.img}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={70}
                        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.68,0.32,1)] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    </div>
                    <div className="border-t border-line pt-7 transition-colors duration-500 group-hover:border-brand-yellow">
                    <p className="font-data text-[12px] uppercase tracking-[0.08em] text-brand-yellow">
                      {step.n}
                    </p>
                    <h3 className="mt-5 text-[clamp(1.5rem,2.6vw,2rem)] text-ink">{step.title}</h3>
                    <p className="mt-5 max-w-[38ch] text-[15px] leading-relaxed text-mute md:text-[16px]">
                      {step.body}
                    </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={420}>
              <div className="mt-14 flex justify-center">
                <Link href="/contact" className="btn btn-amber">
                  Free Consultation
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── THE PROOF RUN ──────────────────────────────────────────────
             Order is the argument, and it is deliberate:

               Why choose us   the claim, in his own words
               Reviews         other people making the same claim
               Financing       the objection that kills most of these leads
               FAQ             everything left that stops someone calling

             Reviews sit immediately after the claim rather than at the foot of
             the page, because a claim followed by proof is worth more than
             either alone. Financing follows the proof and not the other way
             round: "$0 down" is persuasive once you already believe the work
             is good, and cheap-sounding before that. */}
        <WhyChooseUs />
        <GoogleReviews />
        <Financing />
        <Faq />

        {/* ── CTA ────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-t border-line/40">
          {/* Was palm-shadow at 22% — a wall texture, effectively invisible.
              Now the dusk house, which is the strongest photograph in the set
              and had been sitting unused.

              It runs at full strength rather than washed out, which forces the
              copy onto its own panel: charcoal body text over a real photograph
              measures about 2.9:1 at any opacity that leaves the picture worth
              looking at. The panel keeps the photograph and keeps the type
              legible instead of trading one against the other. */}
          <div className="absolute inset-0">
            <Image
              src="/atmosphere/free-estimate.webp"
              alt=""
              fill
              sizes="100vw"
              quality={68}
              className="object-cover [filter:saturate(1.03)]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,250,248,.62)_0%,rgba(250,250,248,.14)_42%,rgba(250,250,248,.62)_100%)]" />
          </div>

          <div className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
            <Reveal>
              {/* ground/95 measured, not picked: over the darkest pixel in this
                  photograph the muted body copy still reads 4.76:1. */}
              <div className="mx-auto max-w-[840px] surface bg-ground/20 px-7 py-14 text-center shadow-[0_20px_70px_-28px_rgba(56,56,56,.5)] backdrop-blur-[6px] md:px-16 md:py-20">
                <p className="u-data mb-8">Free estimates</p>
                {/* Was clamped to 5rem against the full 1400px container. Inside
                    a 720px panel that overflowed the card on desktop. */}
                <h2 className="mx-auto max-w-[20ch] text-[clamp(2rem,5vw,3.5rem)] text-ink">
                  Ready to transform your living space?
                </h2>
                <p className="mx-auto mt-8 max-w-[46ch] text-[17px] leading-relaxed text-mute">
                  Tell us what you are planning. We will come out, look at it properly, and give you
                  a number you can rely on.
                </p>
                <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                  <Link href="/contact" className="btn btn-amber">
                    Request a quote
                  </Link>
                  <a href={BUSINESS.phoneHref} className="btn btn-ghost btn-tel">
                    {BUSINESS.phone}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
        <ContactBlock />
      </main>

      <SiteFooter />
      <CallBar />
      <QuotePopup />
    </>
  );
}
