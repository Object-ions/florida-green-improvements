import Link from "next/link";
import { Plus } from "lucide-react";
import { BUSINESS, FAQS } from "@/lib/business";
import { Reveal } from "@/components/reveal";

/**
 * FAQ — native <details>/<summary>, no JavaScript and no dependency.
 *
 * Deliberate, not lazy. <details> gives keyboard operation, the correct
 * ARIA semantics and open/close state for free, and every answer is in the
 * HTML whether or not it is expanded — so it is indexable, findable with
 * ctrl-F, and readable if scripting fails. An accordion built out of buttons
 * and useState gets none of that without work, and usually gets it wrong.
 *
 * The heading lives inside <summary>, which the spec allows, so the page's
 * h2 → h3 order survives.
 *
 * Answers are the client's own, adapted only where they named services the
 * company no longer sells. Nothing legal, financial, insurance, tax or
 * eligibility-related is answered beyond what he already published — the
 * financing answer points at a conversation rather than at terms.
 */
export function Faq() {
  return (
    <section id="faq" className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <p className="u-data mb-6">FAQ</p>
              <h2 className="max-w-[14ch] text-[clamp(1.875rem,4.4vw,3.25rem)] text-ink">
                Got a question?
              </h2>
              <p className="mt-8 max-w-[40ch] text-[17px] leading-relaxed text-mute md:text-[18px]">
                If you have a question for us, see if we have answered it below — these are the ones
                people ask us about the most.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/contact" className="btn btn-ghost">
                  Ask us something else
                </Link>
                <a href={BUSINESS.phoneHref} className="btn btn-ghost btn-tel">
                  {BUSINESS.phone}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="border-t border-line">
              {FAQS.map((faq) => (
                <details key={faq.q} className="faq-item group border-b border-line">
                  <summary className="flex cursor-pointer items-start justify-between gap-6 py-6 md:py-7">
                    <h3 className="max-w-[46ch] text-[clamp(1.0625rem,1.9vw,1.375rem)] leading-[1.15] text-ink transition-colors group-hover:text-brand-yellow group-open:text-ink">
                      {faq.q}
                    </h3>
                    <span
                      aria-hidden
                      className="faq-icon surface-sm mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-line text-mute transition-[transform,color,border-color] duration-300 group-hover:border-ink group-hover:text-ink"
                    >
                      <Plus size={14} strokeWidth={1.5} />
                    </span>
                  </summary>
                  <p className="max-w-[62ch] pb-7 pr-10 text-[15px] leading-relaxed text-mute md:text-[16px]">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
