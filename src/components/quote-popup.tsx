"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { BUSINESS, RENOVATION_CATEGORIES } from "@/lib/business";
import { track } from "@/components/analytics";

/**
 * The first-quote lead popup.
 *
 * MESSAGE HIERARCHY, which is the whole brief for this component. The client's
 * note was that the old one read as "one long sentence". So there are four
 * levels and nothing competes inside a level:
 *
 *   1. eyebrow   Free estimate · No obligation      — the offer, quietly
 *   2. headline  RENOVATE YOUR HOME                 — the only large type
 *   3. one line  what to do next
 *   4. five      the categories, as TAPPABLE TARGETS rather than prose
 *
 * The categories are links, not a list. Picking one carries the choice into
 * the quote form (?service=), so the visitor who clicks "Kitchen" arrives at a
 * form already set to Kitchen instead of answering the same question twice.
 *
 * BEHAVIOUR. Once per session, after a delay, never on the pages where the
 * visitor is already doing the thing the popup asks for (/contact). Dismissal
 * is remembered for the session. Nothing here fires under
 * prefers-reduced-motion beyond an instant fade.
 *
 * ACCESSIBILITY. Real modal semantics: role="dialog" + aria-modal, focus moved
 * in on open and returned to whatever had it on close, Escape closes, Tab is
 * trapped inside the panel, and the page behind it cannot scroll.
 */

const STORAGE_KEY = "fg-quote-popup-seen";
const DELAY_MS = 18_000;

export function QuotePopup({ delay = DELAY_MS }: { delay?: number } = {}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const close = useCallback((reason: string) => {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* Private mode with storage disabled. The popup simply shows again. */
    }
    track("popup_close", { popup: "renovate_your_home", reason });
  }, []);

  /* Open once per session, on a timer. */
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (seen) return;
    if (window.location.pathname.startsWith("/contact")) return;

    const id = window.setTimeout(() => {
      restoreFocusTo.current = document.activeElement as HTMLElement | null;
      setOpen(true);
      track("popup_view", { popup: "renovate_your_home" });
    }, delay);

    return () => window.clearTimeout(id);
  }, [delay]);

  /* Escape, focus trap, focus restore, and a locked body behind the panel. */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    /* Focus the panel, not the first control. Focusing the close button moves
       the visible ring onto "×" the instant the dialog appears, which reads as
       "you were about to dismiss this". The panel carries tabindex="-1" so it
       can take focus without joining the tab order; screen readers announce
       the dialog and its title, and the first Tab lands on the close button as
       it should. */
    panel?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close("escape");
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreFocusTo.current?.focus?.();
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) close("backdrop");
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-popup-title"
        aria-describedby="quote-popup-lede"
        tabIndex={-1}
        /* Bottom sheet on a phone, centred card from `sm`. A centred card on a
           375px screen either overflows or shrinks the type below the point
           where the hierarchy still reads. `max-h` + scroll so the panel can
           never trap content off-screen in landscape. */
        /* outline-none on the panel only. It is focused programmatically and
           is not a control; the ring belongs on the buttons and links inside
           it, which keep theirs. */
        className="relative max-h-[92svh] w-full max-w-[620px] overflow-y-auto rounded-t-[10px] border border-line bg-ground px-6 pb-7 pt-9 shadow-[0_-20px_60px_-30px_rgba(56,56,56,.5)] outline-none sm:rounded-[10px] sm:px-10 sm:pb-10 sm:pt-11 sm:shadow-[0_30px_90px_-40px_rgba(56,56,56,.55)]"
      >
        <button
          type="button"
          onClick={() => close("button")}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center text-mute transition-colors hover:text-ink"
        >
          <X size={18} strokeWidth={1.5} aria-hidden />
        </button>

        {/* 1 — the offer */}
        <p className="u-data text-green">Free estimate · No obligation</p>

        {/* 2 — the only large type in the panel */}
        <h2
          id="quote-popup-title"
          className="mt-5 text-[clamp(2rem,7vw,3rem)] leading-[0.95] text-ink"
        >
          Renovate your home
        </h2>

        {/* 3 — one line, and it is a line, not a paragraph */}
        <p id="quote-popup-lede" className="mt-5 max-w-[42ch] text-[16px] leading-relaxed text-mute">
          Tell us which part of the home you are planning and we will come out, look at it properly,
          and give you a number you can rely on.
        </p>

        {/* 4 — the categories, as targets */}
        <p className="u-data mt-7 mb-3 sm:mt-9 sm:mb-4">What are you renovating?</p>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {RENOVATION_CATEGORIES.map((cat) => (
            <li key={cat.label}>
              <Link
                href={`/contact?service=${encodeURIComponent(cat.service)}`}
                onClick={() => {
                  track("popup_category_click", { category: cat.service });
                  close("category");
                }}
                className="surface flex min-h-[52px] items-center justify-between gap-3 border border-line bg-raise px-4 py-3 font-data text-[12px] font-medium uppercase tracking-[0.07em] text-ink transition-colors hover:border-brand-yellow hover:bg-sink"
              >
                {cat.label}
                <span aria-hidden className="text-brand-yellow">
                  &rarr;
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-line/60 pt-6 sm:mt-8 sm:pt-7">
          <Link
            href="/contact"
            onClick={() => {
              track("cta_click", { location: "popup" });
              close("cta");
            }}
            className="btn btn-amber"
          >
            Request a free quote
          </Link>
          <a
            href={BUSINESS.phoneHref}
            onClick={() => track("phone_click", { location: "popup" })}
            className="btn btn-ghost btn-tel"
          >
            {BUSINESS.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
