import Image from "next/image";
import Link from "next/link";
import { BUSINESS, FINANCING } from "@/lib/business";
import { Reveal } from "@/components/reveal";

/**
 * Financing / $0 down.
 *
 * Every claim is from the client's own /finance page. What is NOT here is
 * deliberate — rates, terms, "up to 30 years", approval guarantees and the
 * PACE programme are all absent, and the note above FINANCING in
 * src/lib/business.ts records why. The disclaimer under the cards is the
 * honest version of "easy approval": we can say it is designed to be
 * accessible, we cannot say anyone will be approved.
 *
 * Photography is the licensed dusk house already in the repo, run at low
 * strength as a ground. Atmosphere only, never a client project (IMG-01).
 */
export function Financing() {
  return (
    <section id="financing" className="relative overflow-hidden border-t border-line/40">
      <div className="absolute inset-0">
        <Image
          src="/atmosphere/service-cta.webp"
          alt=""
          fill
          sizes="100vw"
          quality={48}
          className="object-cover opacity-[0.3] [filter:saturate(.95)]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--fg-ground)_0%,rgba(250,250,248,.84)_45%,var(--fg-ground)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-20">
          <Reveal>
            <div>
              <p className="u-data mb-6">{FINANCING.eyebrow}</p>
              {/* Two lines, not one sentence: "$0 Down" is the thing that stops
                  the scroll and it should not be buried mid-clause. */}
              <h2 className="max-w-[14ch] text-[clamp(2rem,5vw,3.5rem)] text-ink">
                Financing available
                <span className="mt-2 block text-brand-yellow">$0 down options</span>
              </h2>
              <p className="mt-8 max-w-[52ch] text-[17px] leading-relaxed text-mute md:text-[18px]">
                {FINANCING.intro}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/contact" className="btn btn-amber">
                  Check your options
                </Link>
                <a href={BUSINESS.phoneHref} className="btn btn-ghost btn-tel">
                  {BUSINESS.phone}
                </a>
              </div>
            </div>
          </Reveal>

          <div>
            <ul className="grid gap-5">
              {FINANCING.cards.map((card, i) => (
                <Reveal as="li" key={card.title} delay={i * 120}>
                  <div className="surface border border-line bg-raise p-7 transition-colors duration-500 hover:border-brand-yellow md:p-8">
                    <h3 className="text-[clamp(1.25rem,2.2vw,1.625rem)] text-ink">{card.title}</h3>
                    <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-mute md:text-[16px]">
                      {card.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={420}>
              <p className="mt-6 max-w-[60ch] text-[13px] leading-relaxed text-mute">
                {FINANCING.disclaimer}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
