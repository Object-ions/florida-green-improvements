"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { BUSINESS } from "@/lib/business";

/**
 * Adapted from React Bits Pro `contact-9`.
 *
 * The stock block is a "visit us" panel — hours, a directions button and a
 * carousel of café interiors. The split layout and the paginated image stage
 * are worth keeping; nothing else was. Rewritten for The Vault:
 *
 *  - rounded-3xl / rounded-full corners removed; this palette has a 2px radius
 *  - neutral-50/white surfaces swapped for the emerald-black token set
 *  - the "get directions / book a visit" pair replaced by the actual quote form
 *  - hotlinked Unsplash URLs replaced with local, optimised images
 *  - the carousel now shows the client's own work rather than stock interiors
 */

/**
 * Licensed aspirational photography, not client project work. The labels name
 * the SERVICE, never a project, and the images carry no attribution — the
 * client asked for imported high-end imagery rather than his own photographs.
 * See CREDITS.json and IMG-01 in the project log.
 */
/* `pos` is object-position. The carousel frame is PORTRAIT and most of these
   photographs are landscape, so a centre crop discards the subject — the pool
   read as a plain house elevation and the bathroom as a blank wall. Each image
   now names the point that must survive the crop. */
const SHOWCASE = [
  { label: "Kitchens", src: "/showcase/kitchen.webp", pos: "50% 50%" },
  { label: "Bathrooms", src: "/showcase/bathroom.webp", pos: "50% 60%" },
  { label: "Remodeling", src: "/showcase/remodeling.webp", pos: "50% 50%" },
  { label: "Pools", src: "/showcase/pool.webp", pos: "50% 72%" },
  /* Was "Landscaping" over /showcase/landscape.webp. That service was retired
     on Aug 19 and its photograph deleted with it, so the slide now names the
     thing that absorbed the scope and shows the counter, the pergola and the
     water — which is what the label is actually promising. */
  { label: "Outdoor living", src: "/showcase/outdoor-living.webp", pos: "50% 50%" },
];

export function ContactBlock({
  /** Omit on pages whose hero already carries the headline. */
  showHeading = true,
}: {
  showHeading?: boolean;
} = {}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const paginate = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + SHOWCASE.length) % SHOWCASE.length);
  };

  /* Advance on its own every 30s. The timer is keyed on `index`, so any manual
     click restarts the full 30s rather than leaving a half-spent timer about to
     yank the slide out from under the visitor. Paused entirely under
     prefers-reduced-motion — an unattended auto-advancing carousel is exactly
     what that setting is for. */
  useEffect(() => {
    if (reduce) return;
    const id = window.setTimeout(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % SHOWCASE.length);
    }, 30_000);
    return () => window.clearTimeout(id);
  }, [index, reduce]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 0.68, 0.32, 1] } },
  };
  const slide: Variants = {
    enter: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * 48 }),
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: reduce ? 0.2 : 0.7, ease: [0.22, 0.68, 0.32, 1] },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: reduce ? 0 : dir * -48,
      transition: { duration: reduce ? 0.2 : 0.5, ease: [0.22, 0.68, 0.32, 1] },
    }),
  };

  const { address } = BUSINESS;

  return (
    <section id="quote" className="w-full border-t border-line/40 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid w-full max-w-[1400px] items-stretch gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
        {/* ── FORM PANEL ─────────────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="surface flex flex-col justify-between gap-12 border border-line/60 bg-raise p-7 sm:p-9 lg:p-11"
        >
          <div>
            {showHeading ? (
              <motion.div variants={item}>
                <p className="u-data mb-5 text-green">Free estimate · No obligation</p>
                <h2 className="max-w-[15ch] text-[clamp(1.875rem,4vw,3.25rem)] text-ink">
                  Tell us what you are planning
                </h2>
                <p className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-mute">
                  We will come out, look at the work properly, and give you a number you can rely on.
                </p>
              </motion.div>
            ) : (
              <motion.div variants={item}>
                <p className="u-data mb-4 text-green">Request a quote</p>
                <p className="max-w-[46ch] text-[16px] leading-relaxed text-mute">
                  We will come out, look at the work properly, and give you a number you can rely on.
                </p>
              </motion.div>
            )}

            <motion.div variants={item} className="mt-10">
              <QuoteForm />
            </motion.div>
          </div>

          <motion.div
            variants={item}
            className="grid gap-7 border-t border-line/60 pt-8 sm:grid-cols-2"
          >
            <div>
              <p className="u-data mb-3">Call us</p>
              <a
                href={BUSINESS.phoneHref}
                className="font-display text-[clamp(1.25rem,2.4vw,1.625rem)] uppercase text-ink transition-colors hover:text-brand-yellow"
              >
                {BUSINESS.phone}
              </a>
              <p className="mt-2.5 text-[14px] text-mute">Monday to Friday, 9am–5pm</p>
            </div>
            <div>
              <p className="u-data mb-3">Office</p>
              <address className="not-italic text-[15px] leading-relaxed text-ink-2">
                {address.street}
                <br />
                {address.locality}, {address.region} {address.postalCode}
              </address>
            </div>
          </motion.div>
        </motion.div>

        {/* ── WORK CAROUSEL ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 0.68, 0.32, 1] }}
          className="surface relative min-h-[460px] overflow-hidden border border-line/60 bg-sink lg:min-h-[680px]"
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <Image
                src={SHOWCASE[index].src}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                quality={82}
                style={{ objectPosition: SHOWCASE[index].pos }}
                className="object-cover [filter:saturate(.96)_contrast(1.02)]"
              />
              {/* Was .5 top / .85 bottom, which flattened the whole picture to
                  carry two small labels. Now it only darkens the two bands the
                  labels actually sit in and leaves the middle alone. */}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,250,248,.26)_0%,rgba(250,250,248,.02)_24%,rgba(250,250,248,0)_60%,rgba(250,250,248,.40)_100%)]" />
            </motion.div>
          </AnimatePresence>

          <div aria-live="polite" className="absolute left-5 top-5 sm:left-7 sm:top-7">
            <AnimatePresence mode="wait">
              <motion.span
                key={SHOWCASE[index].label}
                initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -6 }}
                transition={{ duration: 0.25 }}
                className="on-photo surface-sm inline-flex items-center border border-line/70 bg-ground/60 px-3.5 py-2 font-data text-[11px] font-medium uppercase tracking-[0.1em] text-ink backdrop-blur-sm"
              >
                {SHOWCASE[index].label}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-4 sm:inset-x-7 sm:bottom-7">
            <p className="on-photo flex items-center gap-2 font-data text-[11px] uppercase tracking-[0.1em] text-ink-2 tabular-nums">
              <Star size={12} strokeWidth={0} fill="currentColor" className="text-brand-yellow" aria-hidden />
              {BUSINESS.rating.value.toFixed(1)} · {BUSINESS.rating.count} reviews
            </p>

            <div className="flex items-center gap-2.5">
              <span className="on-photo mr-2 font-data text-[11px] tabular-nums text-ink-2">
                {String(index + 1).padStart(2, "0")} / {String(SHOWCASE.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => paginate(-1)}
                aria-label="Previous image"
                className="btn-icon btn-ghost bg-ground/60 backdrop-blur-sm hover:border-ink"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => paginate(1)}
                aria-label="Next image"
                className="btn-icon btn-amber"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
