"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

/**
 * Google Consent Mode v2.
 *
 * Analytics storage starts DENIED. gtag still loads and sends cookieless
 * pings, so basic modelling works, but nothing is written to the visitor's
 * machine until they say yes. Clarity is not loaded at all before consent —
 * it sets three third-party cookies the moment it runs.
 *
 * The choice is remembered in localStorage, which is exempt from consent
 * because it is strictly necessary to honour the choice itself.
 */

const KEY = "fgi-consent";
export type ConsentState = "granted" | "denied" | null;

const ConsentContext = createContext<{
  consent: ConsentState;
  setConsent: (v: Exclude<ConsentState, null>) => void;
}>({ consent: null, setConsent: () => {} });

export const useConsent = () => useContext(ConsentContext);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<ConsentState>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === "granted" || stored === "denied") setConsentState(stored);
    } catch {
      // Private browsing can throw on localStorage. Treat as no decision yet.
    }
    setReady(true);
  }, []);

  const setConsent = useCallback((value: Exclude<ConsentState, null>) => {
    setConsentState(value);
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* nothing we can do; the banner will simply ask again next visit */
    }
    const w = window as unknown as { gtag?: (...a: unknown[]) => void };
    w.gtag?.("consent", "update", {
      analytics_storage: value,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }, []);

  return (
    <ConsentContext.Provider value={{ consent, setConsent }}>
      {children}
      {ready && consent === null ? <ConsentBanner onChoose={setConsent} /> : null}
    </ConsentContext.Provider>
  );
}

function ConsentBanner({ onChoose }: { onChoose: (v: "granted" | "denied") => void }) {
  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-ground/97 backdrop-blur-md md:bottom-0"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between md:gap-12 md:px-10">
        <div>
          <p className="u-data mb-2.5 text-green">Cookies</p>
          <p className="max-w-[62ch] text-[15px] leading-relaxed text-ink-2">
            We use Google Analytics to understand how people find and use this site, so we can
            make it better. Nothing is stored on your device unless you accept. We never sell
            your data.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onChoose("denied")}
            className="border border-line px-7 py-3.5 font-data text-[12px] uppercase tracking-[0.1em] text-ink transition-colors hover:border-ink"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => onChoose("granted")}
            className="bg-amber px-7 py-3.5 font-data text-[12px] font-medium uppercase tracking-[0.1em] text-on-amber transition-opacity hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
