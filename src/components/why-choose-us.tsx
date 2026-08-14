import Link from "next/link";
import { BUSINESS, WHY_CHOOSE_US } from "@/lib/business";
import { Reveal } from "@/components/reveal";

/**
 * Why Choose Florida Green Improvements.
 *
 * The copy is the client's own — his "Why Choose Us" block plus his homepage
 * benefit cards — and lives in src/lib/business.ts. Nothing here promises a
 * warranty length, a saving figure or an approval outcome, because none of
 * those numbers exist in anything he has published.
 *
 * Numbered hairline cards rather than icons: this palette already carries the
 * same treatment on "How it works" and on the service detail points, so the
 * section reads as part of the page instead of a bought-in widget.
 */
export function WhyChooseUs() {
  return (
    <section id="why-us" className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <p className="u-data mb-6">Why choose us</p>
              <h2 className="max-w-[16ch] text-[clamp(1.875rem,4.4vw,3.25rem)] text-ink">
                Why homeowners choose Florida Green
              </h2>
              <p className="mt-8 max-w-[44ch] text-[17px] leading-relaxed text-mute md:text-[18px]">
                Our commitment is to provide the best service to homeowners like you — work that
                holds up in the Florida climate, at a price that works with your budget.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/contact" className="btn btn-amber">
                  Get a free estimate
                </Link>
                <a href={BUSINESS.phoneHref} className="btn btn-ghost btn-tel">
                  {BUSINESS.phone}
                </a>
              </div>

              <p className="mt-8 font-data text-[12px] uppercase tracking-[0.09em] text-mute">
                Licence {BUSINESS.license} · {BUSINESS.licenseLabel}
              </p>
            </div>
          </Reveal>

          <ul className="grid gap-x-12 gap-y-11 sm:grid-cols-2">
            {WHY_CHOOSE_US.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 90}>
                <div className="border-t border-line pt-6 transition-colors duration-500 hover:border-brand-yellow">
                  <p className="font-data text-[12px] uppercase tracking-[0.08em] text-brand-yellow">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-[clamp(1.25rem,2.2vw,1.625rem)] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-mute md:text-[16px]">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
