"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The Vault has exactly one motion idea: things arrive slowly, from below,
 * once. No hover tricks, no parallax scattered across the page.
 *
 * The hiding is done in CSS behind a `.js` class that an inline script in the
 * document head sets before first paint. If JavaScript never runs, the class
 * is never added, no element is ever hidden, and the page reads in full.
 * Doing this with inline `opacity: 0` — the obvious approach — ships HTML
 * whose entire body is invisible without JS.
 *
 * `prefers-reduced-motion` is honoured in globals.css, which also unhides
 * everything, so a reduced-motion visitor gets the content with no animation.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "section" | "li" | "p";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    // Anything already on screen at first paint reveals immediately, so
    // above-the-fold content never waits on a scroll that may not happen.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.02 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref}
      className={`fg-reveal ${className}`}
      data-shown={shown ? "true" : "false"}
      style={delay ? ({ "--fg-reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Component>
  );
}
