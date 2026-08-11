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
export function SiteNav() {
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
        solid ? "bg-ground/95 backdrop-blur-sm border-b border-line/40" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-5 md:px-10">
        <Link
          href="/"
          className="font-data text-[11px] uppercase tracking-[0.09em] text-ink transition-opacity hover:opacity-70"
        >
          Florida Green
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {PRIMARY_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="font-data text-[12px] uppercase tracking-[0.08em] text-mute transition-colors hover:text-ink"
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
            className="hidden font-data text-[12px] uppercase tracking-[0.1em] text-ink transition-colors hover:text-brass sm:inline"
          >
            {BUSINESS.phone}
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="text-ink transition-opacity hover:opacity-70 md:hidden"
          >
            <Menu size={20} strokeWidth={1.25} aria-hidden />
          </button>
        </div>
      </nav>

      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-ground md:hidden">
          <div className="flex items-center justify-between px-6 py-5">
            <span className="font-data text-[11px] uppercase tracking-[0.09em] text-ink">Menu</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="text-ink">
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
        className="flex items-center justify-center bg-brass py-4 font-data text-[12px] font-medium uppercase tracking-[0.1em] text-ground"
      >
        Request a quote
      </a>
    </div>
  );
}
