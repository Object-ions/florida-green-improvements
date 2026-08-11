import type { Metadata } from "next";
import Image from "next/image";
import { SiteNav, CallBar } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { QuoteForm } from "@/components/quote-form";
import { BUSINESS } from "@/lib/business";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact & Free Estimates",
  description:
    "Request a free estimate from Florida Green Improvements. Licensed Florida general contractor CGC1529180 serving Miami-Dade and Broward. Call (786) 238-1213.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { address } = BUSINESS;
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <SiteNav />
      <main id="main">
        <section className="relative overflow-hidden border-b border-line/40">
          <div className="absolute inset-0">
            <Image src="/atmosphere/interior-dark.jpg" alt="" fill priority sizes="100vw" quality={38}
              className="object-cover opacity-[0.2] [filter:saturate(.8)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,19,14,.82),var(--fg-ground))]" />
          </div>
          <div className="relative mx-auto max-w-[1400px] px-6 pb-20 pt-40 md:px-10 md:pb-28 md:pt-48">
            <Reveal>
              <p className="u-data mb-7 text-green">Free estimates · No obligation</p>
              <h1 className="max-w-[14ch] text-[clamp(2.5rem,7.5vw,6rem)] text-ink">Tell us what you are planning</h1>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
          <div className="grid gap-20 md:grid-cols-[1.15fr_.85fr] md:gap-24">
            <Reveal>
              <QuoteForm />
            </Reveal>

            <Reveal delay={140}>
              <div className="flex flex-col gap-12">
                <div className="border-t border-line pt-7">
                  <p className="u-data mb-5">Call us</p>
                  <a href={BUSINESS.phoneHref} className="font-display text-[clamp(1.75rem,3.6vw,2.5rem)] uppercase text-ink transition-colors hover:text-brass">
                    {BUSINESS.phone}
                  </a>
                  <p className="mt-4 text-[15px] leading-relaxed text-mute">Monday to Friday, 9am–5pm.</p>
                </div>

                <div className="border-t border-line pt-7">
                  <p className="u-data mb-5">Office</p>
                  <address className="not-italic text-[16px] leading-relaxed text-ink-2">
                    {address.street}<br />{address.locality}, {address.region} {address.postalCode}
                  </address>
                  <p className="mt-4 text-[15px] leading-relaxed text-mute">
                    Serving {BUSINESS.areaServed.slice(0, 2).join(" and ")}.
                  </p>
                </div>

                <div className="border-t border-line pt-7">
                  <p className="u-data mb-5">Credentials</p>
                  <ul className="flex flex-col gap-3 text-[15px] text-mute">
                    <li><span className="text-ink">{BUSINESS.license}</span> — {BUSINESS.licenseLabel}</li>
                    <li><span className="text-ink">{BUSINESS.rating.value.toFixed(1)} ★</span> — {BUSINESS.rating.count} Google reviews</li>
                    <li><span className="text-ink">BBB {BUSINESS.bbb}</span> — Better Business Bureau</li>
                    <li>Licensed and insured</li>
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
      <CallBar />
    </>
  );
}
