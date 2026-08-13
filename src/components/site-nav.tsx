"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { BUSINESS, PRIMARY_NAV, SERVICES } from "@/lib/business";
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
      <nav className="relative mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-5 md:px-10">
        <Link
          href="/"
          className={`relative font-data text-[11px] uppercase tracking-[0.09em] transition-opacity hover:opacity-70 ${
            overDark && !solid ? "text-white" : "text-ink"
          }`}
        >
          Florida Green
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {PRIMARY_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`font-data text-[12px] uppercase tracking-[0.08em] transition-colors ${
                  overDark && !solid ? "text-white/85 hover:text-white" : "text-ink-2 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <a
            href={BUSINESS.phoneHref}
            onClick={() => track("phone_click", { location: "nav" })}
            className={`relative hidden font-data text-[12px] uppercase tracking-[0.1em] transition-colors sm:inline ${
              overDark && !solid ? "text-white hover:text-amber" : "text-ink hover:text-amber-text"
            }`}
          >
            {BUSINESS.phone}
          </a>
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
            <p className="u-data mt-10 mb-4">All services</p>
            <ul className="flex flex-col gap-3 border-t border-line/40 pt-6">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    onClick={() => setOpen(false)}
                    className="font-data text-[11px] uppercase tracking-[0.09em] text-mute"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
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
