import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav, CallBar } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { WhyChooseUs } from "@/components/why-choose-us";
import { QuotePopup } from "@/components/quote-popup";
import { BUSINESS, SERVICES } from "@/lib/business";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About — Licensed General Contractor in North Miami Beach",
  description:
    "Florida Green Improvements is a licensed general contractor (CGC1529180) serving Miami-Dade and Broward, rated 5.0 from 44 Google reviews. One team, one permit, one point of contact.",
  alternates: { canonical: "/about" },
};

const FACTS = [
  { k: BUSINESS.license, v: BUSINESS.licenseLabel },
  { k: `${BUSINESS.rating.value.toFixed(1)} ★`, v: `${BUSINESS.rating.count} Google reviews` },
  { k: String(SERVICES.length), v: "Trades under one contract" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <SiteNav />
      <main id="main">
        <section className="relative flex min-h-[62svh] items-end overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/showcase/about.webp" alt="" fill priority sizes="100vw" quality={74}
              className="object-cover opacity-[1] [filter:saturate(1.04)_contrast(1.03)]" />
            <div className="hero-wash-compact" />
            <div className="absolute inset-0 bg-[radial-gradient(100%_75%_at_80%_20%,rgba(39,107,74,.13),transparent_66%)] mix-blend-multiply" />
          </div>
          <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 pt-40 md:px-10 md:pb-24">
            
              <p className="u-data mb-7 text-ink">Since 2016 · {BUSINESS.address.locality}, Florida</p>
              <h1 className="max-w-[15ch] text-[clamp(2.5rem,7.5vw,6rem)] text-ink">Built by people who answer the phone</h1>
            
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
          <div className="grid gap-14 md:grid-cols-[132px_1fr]">
            <Reveal><p className="u-data md:pt-2">Who we are</p></Reveal>
            <Reveal delay={120}>
              <p className="max-w-[60ch] text-[19px] leading-[1.7] text-ink-2 md:text-[21px]">
                Florida Green Improvements offers high-quality home construction and improvement services at
                an affordable price. As a team of experts, we deliver exceptional craftsmanship, using our
                knowledge and experience to transform your home.
              </p>
              <p className="mt-8 max-w-[60ch] text-[17px] leading-relaxed text-mute md:text-[18px]">
                We are a licensed Florida general contractor, which means one company carries the permit, the
                schedule and the responsibility for the whole job — hurricane-rated impact windows
                and doors, full interior renovation and everything outside the walls.
                You are not managing five trades. You are calling one number.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-line/40">
          <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-24">
            <Reveal><h2 className="u-data mb-12">On the record</h2></Reveal>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
              {FACTS.map((f, i) => (
                <Reveal key={f.k} delay={i * 110}>
                  <div className="border-t border-line pt-6">
                    <p className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] uppercase leading-none text-ink">{f.k}</p>
                    <p className="mt-4 text-[14px] leading-relaxed text-mute">{f.v}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* The client's own "Why Choose Us" block lived on the old About page
            as well as the homepage. Same component, same source copy — one
            place to edit, so the two can never disagree. */}
        <WhyChooseUs />

        <section className="relative overflow-hidden border-t border-line/40">
          <div className="absolute inset-0">
            <Image src="/atmosphere/pool-dusk.webp" alt="" fill sizes="100vw" quality={45}
              className="object-cover opacity-[0.22] [filter:saturate(.95)]" />
            <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_50%,rgba(39,107,74,.2),transparent_70%)] mix-blend-multiply" />
          </div>
          <div className="relative mx-auto max-w-[1400px] px-6 py-28 text-center md:px-10 md:py-40">
            <Reveal>
              <h2 className="mx-auto max-w-[18ch] text-[clamp(2rem,5.5vw,4rem)] text-ink">Ready to transform your living space?</h2>
              <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
                <Link href="/contact" className="btn btn-amber">Request a quote</Link>
                <a href={BUSINESS.phoneHref} className="btn btn-ghost btn-tel">{BUSINESS.phone}</a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
      <CallBar />
      <QuotePopup />
    </>
  );
}
