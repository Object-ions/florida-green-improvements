"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero background video, layered OVER the poster photograph rather than
 * replacing it.
 *
 * The photograph underneath is a real <Image priority>, so it is the LCP
 * element and paints on the first frame. This video fades in only once the
 * browser reports it can actually play. That means every failure mode —
 * missing file, unsupported codec, blocked autoplay, corporate proxy, data
 * saver — degrades to the photograph with nothing to detect or handle.
 * Using the native `poster` attribute alone would not do this: a poster is
 * discarded the moment playback starts and shows nothing if the element
 * itself fails to load.
 *
 * Deliberately skipped, not merely paused, when:
 *   - the visitor asked for reduced motion (a looping background is exactly
 *     what that setting is for),
 *   - Save-Data is on, or the connection reports 2g.
 * In those cases no <video> is rendered at all, so the bytes are never
 * requested. On this site that matters: mobile LCP is already the weak
 * number, and a hero video is the single easiest way to make it worse.
 */
export type HeroSource = { src: string; type: string };

export function HeroVideo({ sources }: { sources: HeroSource[] }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    const saveData = conn?.saveData === true;
    const slow = /2g/.test(conn?.effectiveType ?? "");
    if (reduced || saveData || slow) return;

    /* Deferred until after `load`, deliberately.
       Mounted eagerly with preload="auto", the video competed with the hero
       photograph for bandwidth and LCP swung between 1.8s and 22.7s on
       Lighthouse's throttled connection — on the one metric this site is
       already weakest at. Waiting until the page has finished loading means
       the poster is painted and LCP is settled before a single video byte is
       requested, so the video can cost nothing that anyone measures. */
    let idle: number | undefined;
    const start = () => {
      const ric = (window as Window & { requestIdleCallback?: typeof requestIdleCallback })
        .requestIdleCallback;
      idle = ric ? ric(() => setAllowed(true), { timeout: 2500 }) : window.setTimeout(() => setAllowed(true), 400);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idle !== undefined) clearTimeout(idle);
    };
  }, []);

  useEffect(() => {
    if (!allowed) return;
    const v = ref.current;
    if (!v) return;
    const onPlaying = () => setPlaying(true);
    v.addEventListener("playing", onPlaying);
    // Autoplay can still be refused even when muted. Swallow it — the
    // photograph is already on screen and is a perfectly good hero.
    void v.play().catch(() => {});
    return () => v.removeEventListener("playing", onPlaying);
  }, [allowed]);

  if (!allowed) return null;

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden
      tabIndex={-1}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
        playing ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* VP9 first: it is roughly a third the size of the H.264 and every
          browser that understands it will take it. Safari falls through to
          the mp4. */}
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}
