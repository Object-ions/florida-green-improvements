import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { SiteNav, CallBar } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { ContactBlock } from "@/components/contact-block";
import { CinematicList } from "@/components/ui/cinematic-list";
import { BUSINESS, SERVICES, CATEGORIES, servicesByCategory } from "@/lib/business";
import { businessSchema, JsonLd } from "@/lib/schema";

/* ── THE VAULT ────────────────────────────────────────────────────────
   Photography is the ground of every section. Type sits small and wide
   over it, never bold. Brass appears once per screen and nowhere else. */

const PROCESS = [
  {
    n: "01",
    title: "Plan",
    body: "Permits, construction approval and material scheduling are handled before anyone starts work — so the timeline you are given is the timeline you get.",
  },
  {
    n: "02",
    title: "Design",
    body: "We work through layout, materials, fixtures and finishes with you, with visual aids so you can see the room before it is built. At no additional cost.",
  },
  {
    n: "03",
    title: "Build",
    body: "One licensed general contractor carries the permit, the schedule and the responsibility from demolition through final inspection.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd data={businessSchema()} />
      <SiteNav />

      <main id="main">
        {/* ── HERO ───────────────────────────────────────────────── */}
        <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/atmosphere/hero-alt-glow.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              quality={72}
              className="object-cover opacity-[1] [filter:saturate(1.04)_contrast(1.03)]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(250,250,248,.72)_0%,rgba(250,250,248,.14)_36%,transparent_70%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(to_top,var(--fg-ground)_2%,rgba(250,250,248,.86)_26%,transparent_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_90%_14%,rgba(39,107,74,.24),transparent_68%)] mix-blend-multiply" />
          </div>

          <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end px-6 pb-14 pt-36 md:px-10 md:pb-16">
            <p className="u-data on-photo mb-6 text-ink-2">
                <span className="text-green">&#9679;</span>{" "}
                {BUSINESS.address.locality}, Florida &middot; Licence {BUSINESS.license}
              </p>

            <h1 className="on-photo max-w-[15ch] text-[clamp(2.5rem,7.6vw,5.75rem)] text-ink">
                {BUSINESS.tagline}
              </h1>

            <p className="on-photo mt-7 max-w-[42ch] text-[17px] leading-relaxed text-ink-2 md:text-[19px]">
                Impact windows, kitchens and full remodels for South Florida homes that have to
                survive the season and still look like this.
              </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="bg-amber px-8 py-4 font-data text-[12px] font-medium uppercase tracking-[0.1em] text-on-amber transition-opacity hover:opacity-90"
                >
                  Request a quote
                </Link>
                <a
                  href={BUSINESS.phoneHref}
                  className="on-photo border border-ink/40 bg-ground/50 px-8 py-4 font-data text-[12px] uppercase tracking-[0.1em] text-ink backdrop-blur-[2px] transition-colors hover:border-ink"
                >
                  {BUSINESS.phone}
                </a>
              </div>
            
          </div>

          <div className="relative mx-auto w-full max-w-[1400px] border-t border-line/40 px-6 py-6 md:px-10">
              <ul className="flex flex-wrap items-center gap-x-10 gap-y-3">
                <li className="on-photo flex items-center gap-2 font-data text-[12px] uppercase tracking-[0.1em] text-ink-2">
                  <Star size={12} strokeWidth={0} fill="currentColor" className="text-amber-text" aria-hidden />
                  {BUSINESS.rating.value.toFixed(1)} · {BUSINESS.rating.count} Google reviews
                </li>
                <li className="on-photo font-data text-[12px] uppercase tracking-[0.1em] text-ink-2">
                  Licensed &amp; insured
                </li>
                <li className="on-photo font-data text-[12px] uppercase tracking-[0.1em] text-ink-2">
                  BBB {BUSINESS.bbb}
                </li>
                <li className="on-photo font-data text-[12px] uppercase tracking-[0.1em] text-ink-2">
                  Miami-Dade &amp; Broward
                </li>
              </ul>
            </div>
          
        </section>

        {/* ── STATEMENT ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
          <div className="grid gap-14 md:grid-cols-[132px_1fr]">
            <Reveal>
              <p className="u-data md:pt-3">About</p>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="max-w-[24ch] text-[clamp(1.75rem,4vw,3.25rem)] font-display uppercase leading-[0.98] text-ink">
                One contractor for the whole job.
              </h2>
              <p className="mt-10 max-w-[62ch] text-[17px] leading-relaxed text-mute md:text-[18px]">
                Florida Green Improvements is a licensed general contractor working across impact
                glazing, full interior renovation and outdoor living. One permit, one schedule, one
                point of contact — from the first drawing to the final inspection.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── SERVICES, split indoor / outdoor ──────────────────── */}
        <section id="services" className="border-t border-line">
          <div className="mx-auto max-w-[1400px] px-6 pt-24 md:px-10 md:pt-32">
            <Reveal>
              <h2 className="u-data">Services · {SERVICES.length}</h2>
            </Reveal>
          </div>

          <div id="work" className="mx-auto max-w-[1400px] px-6 pb-24 md:px-10 md:pb-32">
            {CATEGORIES.map((cat, ci) => (
              <div key={cat.id} className={ci ? "mt-20 md:mt-28" : "mt-12"}>
                <Reveal>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pb-6">
                    <h3 className="text-[clamp(1.75rem,4vw,3rem)] text-ink">{cat.label}</h3>
                    <p className="max-w-[42ch] text-[15px] text-mute md:text-[16px]">{cat.blurb}</p>
                  </div>
                </Reveal>

                <Reveal delay={120}>
                  <CinematicList
                    items={servicesByCategory(cat.id).map((s, i) => ({
                      id: String(i + 1).padStart(2, "0"),
                      title: s.name,
                      meta: cat.label,
                      href: `/services/${s.slug}`,
                      src: `/showcase/${s.slug}.jpg`,
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
              src="/atmosphere/roof-lines.jpg"
              alt=""
              fill
              sizes="100vw"
              quality={55}
              className="object-cover opacity-[0.28] [filter:saturate(.9)]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--fg-ground)_0%,rgba(250,250,248,.86)_45%,var(--fg-ground)_100%)]" />
          </div>

          <div className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
            <Reveal>
              <h2 className="u-data mb-14">How it works</h2>
            </Reveal>
            <div className="grid gap-14 md:grid-cols-3 md:gap-12">
              {PROCESS.map((step, i) => (
                <Reveal key={step.n} delay={i * 140}>
                  <div className="border-t border-line pt-7">
                    <p className="font-data text-[12px] uppercase tracking-[0.08em] text-green">
                      {step.n}
                    </p>
                    <h3 className="mt-5 text-[clamp(1.5rem,2.6vw,2rem)] text-ink">{step.title}</h3>
                    <p className="mt-5 max-w-[38ch] text-[15px] leading-relaxed text-mute md:text-[16px]">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-t border-line/40">
          <div className="absolute inset-0">
            <Image
              src="/atmosphere/palm-shadow.jpg"
              alt=""
              fill
              sizes="100vw"
              quality={45}
              className="object-cover opacity-[0.22] [filter:grayscale(.25)]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_50%,rgba(39,107,74,.22),transparent_70%)] mix-blend-multiply" />
          </div>

          <div className="relative mx-auto max-w-[1400px] px-6 py-32 text-center md:px-10 md:py-48">
            <Reveal>
              <p className="u-data mb-8">Free estimates</p>
              <h2 className="mx-auto max-w-[16ch] text-[clamp(2.25rem,6.5vw,5rem)] text-ink">
                Ready to transform your living space?
              </h2>
              <p className="mx-auto mt-8 max-w-[46ch] text-[17px] leading-relaxed text-mute">
                Tell us what you are planning. We will come out, look at it properly, and give you a
                number you can rely on.
              </p>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-amber px-9 py-4 font-data text-[12px] font-medium uppercase tracking-[0.1em] text-on-amber transition-opacity hover:opacity-90"
                >
                  Request a quote
                </Link>
                <a
                  href={BUSINESS.phoneHref}
                  className="border border-ink/40 px-9 py-4 font-data text-[12px] uppercase tracking-[0.1em] text-ink transition-colors hover:border-ink"
                >
                  {BUSINESS.phone}
                </a>
              </div>
            </Reveal>
          </div>
        </section>
        <ContactBlock />
      </main>

      <SiteFooter />
      <CallBar />
    </>
  );
}
