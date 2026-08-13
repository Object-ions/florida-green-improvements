"use client";

import Script from "next/script";
import { useConsent } from "@/components/consent";

const GA = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CLARITY = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

/**
 * Measurement layer. The old site carried none of this — no GA, no pixel, no
 * tag manager on any of 15 pages (baseline finding F-04), which is why there
 * is no record of a single visitor before today.
 *
 * Consent Mode v2: the default state is set BEFORE the gtag script loads, so
 * no storage is ever written ahead of a decision. gtag still sends cookieless
 * pings under denial, which keeps Google's modelling useful without putting
 * anything on the visitor's machine.
 *
 * Clarity is held back entirely until consent — it writes three third-party
 * cookies as soon as it executes.
 *
 * Both load `afterInteractive` so neither costs LCP. The Vault is
 * photography-heavy; analytics must not tax the thing we are fixing.
 */
export function Analytics() {
  const { consent } = useConsent();

  return (
    <>
      {GA ? (
        <>
          {/* Must run before gtag.js — hence beforeInteractive. */}
          <Script id="ga-consent-default" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              });
            `}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              gtag('js', new Date());
              gtag('config', '${GA}', { send_page_view: true });
            `}
          </Script>
        </>
      ) : null}

      {CLARITY && consent === "granted" ? (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY}");
          `}
        </Script>
      ) : null}
    </>
  );
}

type EventName =
  | "phone_click"
  | "whatsapp_click"
  | "form_start"
  | "form_submit"
  | "quote_request"
  | "service_view"
  /* Header + section CTAs added Aug 12. Tracked separately from
     quote_request so we can see which entry point earns the lead. */
  | "cta_click";

/**
 * Fire a GA4 conversion event. These are the numbers that turn "the site looks
 * better" into "the site produced N leads" — the whole basis of the SEO upsell.
 */
export function track(name: EventName, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  w.gtag?.("event", name, params);
}
