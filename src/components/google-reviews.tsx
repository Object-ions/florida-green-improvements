import { Star } from "lucide-react";
import { BUSINESS, GOOGLE_REVIEWS, GOOGLE_REVIEWS_URL } from "@/lib/business";
import { Reveal } from "@/components/reveal";

/**
 * Google reviews — real ones, or none at all.
 *
 * The text lives in src/lib/business.ts and is verbatim. Nothing in this file
 * shortens, tidies or completes a customer's words; the only thing it adds is
 * the "…" on a review Google itself serves collapsed, next to a link to the
 * full one. See the note above GOOGLE_REVIEWS.
 *
 * The mark is Google's own four-colour G, which is what makes the section
 * legible at a glance as third-party proof rather than a testimonial the
 * company wrote about itself — the whole reason the client asked for it.
 */

function GoogleMark({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7A21.99 21.99 0 0 0 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18a13.2 13.2 0 0 1 0-8.36v-5.7H4.34a21.99 21.99 0 0 0 0 19.76l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

/* A <span>, not a <p>: this is rendered inside the rating line, which is
   itself a <p>. Nesting one inside the other is invalid HTML and shows up as
   a hydration error the moment React reconciles the browser's repaired DOM. */
function Stars({ rating }: { rating: number }) {
  return (
    <span
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className="inline-flex items-center gap-0.5"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          strokeWidth={0}
          fill="currentColor"
          aria-hidden
          className={i < rating ? "text-brand-yellow" : "text-line"}
        />
      ))}
    </span>
  );
}

export function GoogleReviews() {
  const { rating } = BUSINESS;

  return (
    <section id="reviews" className="border-t border-line/40 bg-sink">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b border-line pb-8">
            <div>
              <p className="u-data mb-5">Reviews</p>
              <h2 className="max-w-[20ch] text-[clamp(1.75rem,4vw,3rem)] text-ink">
                What our customers say on Google
              </h2>
            </div>

            {/* The rating panel, not a badge: the mark, the number and the
                count read as one object so nobody has to work out where the
                score came from. */}
            <div className="surface flex items-center gap-4 border border-line bg-raise px-5 py-4">
              <GoogleMark size={26} />
              <div>
                <p className="flex items-center gap-2 font-display text-[1.5rem] uppercase leading-none text-ink">
                  {rating.value.toFixed(1)}
                  <Stars rating={5} />
                </p>
                <p className="mt-2 font-data text-[11px] uppercase tracking-[0.09em] text-mute">
                  {rating.count} Google reviews
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-6 md:mt-14 md:grid-cols-3 md:gap-7">
          {GOOGLE_REVIEWS.items.map((review, i) => (
            <Reveal as="li" key={review.author} delay={i * 130}>
              <figure className="surface flex h-full flex-col justify-between gap-8 border border-line bg-raise p-7 md:p-8">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <Stars rating={review.rating} />
                    <GoogleMark />
                  </div>

                  {/* The ellipsis is spaced off the quote rather than glued to
                      it — the stored text already ends in a full stop, and
                      "promised.…" reads as a typo rather than as an elision. */}
                  <blockquote className="mt-6 text-[16px] leading-relaxed text-ink-2">
                    <p>
                      &ldquo;{review.body}
                      {review.truncated ? " …" : ""}&rdquo;
                    </p>
                  </blockquote>
                </div>

                <figcaption className="border-t border-line/70 pt-5">
                  <p className="font-data text-[12px] font-medium uppercase tracking-[0.08em] text-ink">
                    {review.author}
                  </p>
                  <p className="mt-2 font-data text-[11px] uppercase tracking-[0.08em] text-mute">
                    {review.truncated ? (
                      <a
                        href={GOOGLE_REVIEWS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-brand-yellow"
                      >
                        Read the full review on Google
                      </a>
                    ) : (
                      "Verified Google review"
                    )}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={420}>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <GoogleMark size={15} />
              Read all {rating.count} reviews
            </a>
            <p className="text-[14px] text-mute">
              Reviews are shown as written by the customer on Google.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
