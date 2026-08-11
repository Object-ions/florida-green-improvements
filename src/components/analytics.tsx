"use client";

import Script from "next/script";

const GA = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CLARITY = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

/**
 * Measurement layer. The old site carried none of this — no GA, no pixel, no
 * tag manager on any of 15 pages (baseline finding F-04), which is why there
 * is no record of a single visitor before today.
 *
 * Both scripts load `afterInteractive` so they never block LCP. The Vault is
 * photography-heavy; analytics must not cost us the thing we are fixing.
 */
export function Analytics() {
  return (
    <>
      {GA ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA}', { send_page_view: true });
            `}
          </Script>
        </>
      ) : null}

      {CLARITY ? (
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
  | "service_view";

/**
 * Fire a GA4 conversion event. These are the numbers that turn "the site looks
 * better" into "the site produced N leads" — the whole basis of the SEO upsell.
 */
export function track(name: EventName, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  w.gtag?.("event", name, params);
}
