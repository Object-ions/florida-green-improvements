import type { Metadata } from "next";
import Image from "next/image";
import { SiteNav, CallBar } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { ContactBlock } from "@/components/contact-block";
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
            <Image src="/atmosphere/interior-dark.jpg" alt="" fill priority sizes="100vw" quality={62}
              className="object-cover opacity-[0.5] [filter:saturate(.95)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,250,248,.82),var(--fg-ground))]" />
          </div>
          <div className="relative mx-auto max-w-[1400px] px-6 pb-20 pt-40 md:px-10 md:pb-28 md:pt-48">
            
              <p className="u-data mb-7 text-green">Free estimates · No obligation</p>
              <h1 className="max-w-[14ch] text-[clamp(2.5rem,7.5vw,6rem)] text-ink">Tell us what you are planning</h1>
            
          </div>
        </section>

        <ContactBlock showHeading={false} />
      </main>
      <SiteFooter />
      <CallBar />
    </>
  );
}
