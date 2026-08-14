"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { BUSINESS, CATEGORIES, PRIMARY_NAV, servicesByCategory } from "@/lib/business";
import { track } from "@/components/analytics";

/**
 * The Vault's nav: transparent over the hero photograph, resolving to solid
 * emerald-black once you leave it. Wide letter-spacing, no weight, no colour.
 */
export function SiteNav({ overDark = false }: { overDark?: boolean } = {}) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "bg-ground/95 backdrop-blur-sm border-b border-line" : "bg-transparent"
      }`}
    >
      {/* Over a photograph the nav text has nothing to sit on — the phone
          number used to vanish into the sky. A scrim gives it a floor without
          reading as a bar. `overDark` flips it for the homepage, whose hero is
          a dark video: the bone scrim and charcoal text are both invisible
          there. Hidden once the nav goes solid, which is light on every page. */}
      {!solid ? (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 h-28 ${
            overDark
              ? "bg-[linear-gradient(to_bottom,rgba(16,16,16,.62),rgba(16,16,16,.28)_50%,transparent)]"
              : "bg-[linear-gradient(to_bottom,rgba(250,250,248,.92),rgba(250,250,248,.55)_45%,transparent)]"
          }`}
        />
      ) : null}
      {/* Tighter gaps between md and lg. At exactly 768 the full nav appears
          for the first time and has to share the bar with the logo, the phone
          number and the CTA — at gap-9 every one of those wrapped onto two or
          three lines. Nothing here changes above lg. */}
      <nav className="relative mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-5 md:px-10 lg:gap-6">
        <Link
          href="/"
          className={`relative whitespace-nowrap font-data text-[11px] uppercase tracking-[0.09em] transition-opacity hover:opacity-70 ${
            overDark && !solid ? "text-white" : "text-ink"
          }`}
        >
          Florida Green
        </Link>

        <ul className="hidden items-center gap-5 md:flex lg:gap-9">
          {PRIMARY_NAV.map((item) => {
            const linkClass = `font-data text-[12px] uppercase tracking-[0.08em] transition-colors ${
              overDark && !solid ? "text-white/85 hover:text-white" : "text-ink-2 hover:text-ink"
            }`;

            /* Services carries a dropdown of every service page. CSS-driven —
               `group-hover` for the mouse, `focus-within` for the keyboard, so
               tabbing through the panel holds it open with no JS state and no
               timers to leak. The panel has no top margin: a gap between the
               trigger and the menu is the classic way these close under the
               cursor on the way down. `pt-4` inside the wrapper is the bridge.

               Grouped by category since the Aug 13 revision. A flat list of
               nine links gave the visitor no way to see that impact windows,
               indoor rooms and the garden are three different conversations —
               and it was where "Impact Glazing" was still showing. Three
               columns, a category heading each, no descriptions: the client
               asked for concise, and the detail belongs on the pages. */
            if (item.label === "Services") {
              return (
                <li key={item.href} className="group relative">
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                  <div className="pointer-events-none absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                    {/* Three columns only where there is room for them. The
                        desktop nav starts at md (768px), and a 760px three-up
                        panel centred on a trigger sitting left of centre hung
                        67px off the left edge of a 768 tablet — measured, not
                        guessed. Below lg the groups stack instead, which is
                        narrow enough to stay inside the viewport at 768. */}
                    <div className="flex max-h-[70svh] max-w-[min(88vw,760px)] flex-col gap-5 overflow-y-auto surface border border-line bg-ground/97 p-6 shadow-[0_18px_50px_-20px_rgba(56,56,56,.35)] backdrop-blur-md lg:flex-row lg:gap-8 lg:overflow-visible">
                      {/* Two levels that cannot be confused for each other.

                          The first cut had the group heading and its links at
                          the same 12px uppercase tracked setting in two shades
                          of grey, with headings wrapping to three lines — so
                          every column read as six sibling items. Now the
                          heading is the small tracked label and the services
                          are larger, darker and in normal case, which is
                          exactly how the footer already sets a list of
                          services. Case is doing most of the work: it
                          separates the two levels at a glance in a way that a
                          shade of grey never did. */}
                      {CATEGORIES.map((cat) => (
                        /* 208px is what "Impact Windows & Doors" needs to stay
                           on one line at 15px. Three of those plus the gaps
                           and padding come to 712px, inside the 760 cap. */
                        <div key={cat.id} className="min-w-[208px]">
                          <Link
                            href={`/#${cat.anchor}`}
                            className="u-data block whitespace-nowrap transition-colors hover:text-ink"
                          >
                            {cat.label}
                          </Link>
                          <ul className="mt-3 border-t border-line pt-2">
                            {servicesByCategory(cat.id).map((s) => (
                              <li key={s.slug}>
                                <Link
                                  href={`/services/${s.slug}`}
                                  className="block surface-sm px-2 py-2 text-[15px] leading-snug text-ink-2 transition-colors hover:bg-sink hover:text-ink"
                                >
                                  {s.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3 lg:gap-4">
          <a
            href={BUSINESS.phoneHref}
            onClick={() => track("phone_click", { location: "nav" })}
            /* whitespace-nowrap: a phone number broken across lines is not a
               phone number. It is also the widest single item in the bar, so
               it is the first thing to wrap when the row gets tight. */
            className={`relative hidden whitespace-nowrap font-data text-[12px] uppercase tracking-[0.1em] transition-colors sm:inline ${
              overDark && !solid ? "text-white hover:text-amber" : "text-ink hover:text-brand-yellow"
            }`}
          >
            {BUSINESS.phone}
          </a>
          {/* Header CTA. Hidden below md — the phone bar already pins both
              actions to the bottom of every mobile screen, and a third
              control in a 375px bar would crowd the burger. */}
          <Link
            href="/contact"
            onClick={() => track("cta_click", { location: "nav" })}
            className="btn btn-sm btn-amber hidden md:inline-flex"
          >
            Free Consultation
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            /* The hit area was exactly the 20px icon — the primary navigation
               control on a phone, at less than half the 44px minimum. Negative
               margins absorb the growth so the bar height does not change. */
            className={`-my-3 -mr-3 flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-70 md:hidden ${
              overDark && !solid ? "text-white" : "text-ink"
            }`}
          >
            <Menu size={20} strokeWidth={1.25} aria-hidden />
          </button>
        </div>
      </nav>

      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-ground md:hidden">
          <div className="flex items-center justify-between px-6 py-5">
            <span className="font-data text-[11px] uppercase tracking-[0.09em] text-ink">Menu</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="-my-3 -mr-3 flex h-11 w-11 items-center justify-center text-ink">
              <X size={20} strokeWidth={1.25} aria-hidden />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-10">
            <ul className="flex flex-col gap-1 border-t border-line/40 pt-6">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-display text-3xl uppercase text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Same three groups as the desktop dropdown. A phone has the
                vertical room the dropdown does not, so the category headings
                are links to the matching homepage section and the services sit
                under them — 44px rows, because this is the only navigation a
                thumb gets. */}
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="mt-9">
                <Link
                  href={`/#${cat.anchor}`}
                  onClick={() => setOpen(false)}
                  className="u-data mb-3 block"
                >
                  {cat.label}
                </Link>
                <ul className="flex flex-col border-t border-line/40 pt-1">
                  {servicesByCategory(cat.id).map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex min-h-[44px] items-center text-[16px] text-ink-2"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

/** Mobile-only sticky call bar. Contractors close on the phone. */
export function CallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line/50 bg-ground/95 backdrop-blur-sm md:hidden">
      <a
        href={BUSINESS.phoneHref}
        onClick={() => track("phone_click", { location: "callbar" })}
        className="flex items-center justify-center gap-2 py-4 font-data text-[12px] uppercase tracking-[0.1em] text-ink"
      >
        <Phone size={13} strokeWidth={1.5} aria-hidden /> Call
      </a>
      <a
        href="/contact"
        className="flex items-center justify-center bg-amber py-4 font-data text-[12px] font-medium uppercase tracking-[0.1em] text-on-amber"
      >
        Request a quote
      </a>
    </div>
  );
}
