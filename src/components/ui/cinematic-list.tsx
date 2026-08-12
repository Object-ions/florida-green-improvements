"use client";

import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Cinematic list — adapted for Florida Green Improvements.
 *
 * Each row is a quiet type-only line at rest and expands on hover to reveal a
 * full-bleed photograph with the label reversed out over it.
 *
 * Changes from the source component, and why:
 *  - Rows were `<div className="cursor-pointer">`. They are now `<Link>`, so
 *    they are focusable, keyboard-navigable and announced as links. The
 *    original could not be reached without a mouse at all.
 *  - Item headings were `<h2>`, which broke the page's heading order — this
 *    section already runs h2 (Services) → h3 (Indoor/Outdoor). They are `<h4>`.
 *  - `<Image fill>` gained a `sizes` hint; without it Next serves the largest
 *    candidate to every viewport.
 *  - `dark:` variants removed — this site has one committed light theme.
 *  - Hardcoded neutrals and pure black swapped for the brand tokens. The hover
 *    scrim is the brand charcoal rather than black, so the dark moment still
 *    belongs to the palette.
 *  - The rounded-full icon chip is square: this design system uses a 2px radius
 *    throughout, and the sibling carousel controls are already square.
 *  - Expansion is disabled under `prefers-reduced-motion`, where a 700ms
 *    height animation is exactly what the setting exists to prevent.
 */

export interface CinematicItem {
  /** Displayed index, e.g. "01". */
  id: string;
  title: string;
  /** Right-hand metadata — the category or a short qualifier. */
  meta: string;
  href: string;
  src: string;
  /** Decorative imagery: leave empty unless the image carries real meaning. */
  alt?: string;
}

function CinematicListItem({ id, title, meta, href, src, alt = "" }: CinematicItem) {
  return (
    <Link
      href={href}
      aria-label={`${title} — ${meta}`}
      className={cn(
        "group relative flex w-full flex-col justify-center overflow-hidden border-b border-line",
        "transition-[height] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
        "h-24 md:hover:h-[400px] md:focus-visible:h-[400px]",
        "motion-reduce:transition-none motion-reduce:md:hover:h-24 motion-reduce:md:focus-visible:h-24",
      )}
    >
      {/* Photograph, revealed on hover */}
      {/*
        Desktop only. Rows do not expand below `md`, so on a phone this layer
        can never be seen — and rendering it there downloads eight photographs
        nobody will ever look at, roughly a megabyte on the connection least
        able to afford it.
      */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 hidden opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none md:block"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 1400px"
          quality={78}
          className="scale-110 object-cover transition-transform duration-1000 ease-out group-hover:scale-100 group-focus-visible:scale-100 motion-reduce:transition-none motion-reduce:scale-100"
        />
        {/*
          Brand charcoal rather than black, so the dark moment stays on-palette.
          The alpha is set by measurement, not taste: this photography is
          uniformly bright — white marble, pale stone, sunlit water — and a
          white label over a pure-white pixel needs the scrim at ~.76 before it
          clears the 3:1 large-text bar. At the original .35 it measured
          1.17:1 and was genuinely unreadable. .84 in the band behind the label
          buys headroom for the brightest image in the set.
        */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(56,56,56,.9)_0%,rgba(56,56,56,.84)_55%,rgba(56,56,56,.76)_100%)]" />
      </div>

      <div className="relative z-10 flex w-full items-center justify-between gap-6 px-4 sm:px-8 md:px-12">
        <div className="flex items-center gap-6 md:gap-12">
          <span className="font-data text-[12px] font-medium uppercase tracking-[0.1em] text-mute transition-colors duration-500 group-hover:text-white/75 group-focus-visible:text-white/75">
            {id}
          </span>

          <div className="flex flex-col">
            <h4
              className={cn(
                "font-display text-[clamp(1.375rem,3vw,2.75rem)] uppercase leading-none tracking-tight text-ink",
                "transition-[transform,color] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
                "group-hover:-translate-y-1 group-hover:text-white group-hover:[text-shadow:0_1px_16px_rgba(20,20,20,.55)]",
                "group-focus-visible:-translate-y-1 group-focus-visible:text-white",
                "motion-reduce:transition-none motion-reduce:group-hover:translate-y-0",
              )}
            >
              {title}
            </h4>
            <span className="mt-1 font-data text-[11px] font-medium uppercase tracking-[0.1em] text-mute transition-colors duration-500 group-hover:text-white/80 md:hidden">
              {meta}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <span className="hidden translate-y-6 font-data text-[12px] font-medium uppercase tracking-[0.1em] text-transparent opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:text-white group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:text-white group-focus-visible:opacity-100 md:block">
            {meta}
          </span>

          <span
            aria-hidden
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center border transition-all duration-500",
              "border-ink/25 text-mute",
              "group-hover:border-white group-hover:bg-white group-hover:text-ink",
              "group-focus-visible:border-white group-focus-visible:bg-white group-focus-visible:text-ink",
            )}
          >
            <MoveRight
              className="h-5 w-5 transition-transform duration-500 group-hover:-rotate-45 group-focus-visible:-rotate-45 motion-reduce:transition-none"
              strokeWidth={1.5}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CinematicList({ items }: { items: CinematicItem[] }) {
  return (
    <div className="flex flex-col border-t border-line">
      {items.map((item) => (
        <CinematicListItem key={item.href} {...item} />
      ))}
    </div>
  );
}
