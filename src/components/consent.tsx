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
      /* Was a full-width bar across the bottom of the viewport with three
         lines of copy — it read as a page section rather than a dismissible
         notice, and on a phone it covered the CTA. Now a small corner card.
         `bottom-20` on mobile clears the sticky call bar; the RIGHT corner on
         desktop because the hero CTAs are left-aligned and the first version
         of this card sat directly on top of "Request a quote". */
      className="fixed bottom-20 left-4 right-4 z-[60] rounded-[6px] border border-line bg-ground/97 p-4 shadow-[0_12px_40px_-14px_rgba(56,56,56,.4)] backdrop-blur-md sm:left-auto sm:max-w-[380px] md:bottom-6 md:right-6"
    >
      <p className="text-[13px] leading-[1.5] text-ink-2">
        We use Google Analytics to see how people find this site. Nothing is stored on your device
        unless you accept.
      </p>
      <div className="mt-3.5 flex items-center gap-2">
        <button type="button" onClick={() => onChoose("granted")} className="btn btn-sm btn-amber">
          Accept
        </button>
        <button type="button" onClick={() => onChoose("denied")} className="btn btn-sm btn-ghost">
          Decline
        </button>
      </div>
    </div>
  );
}
