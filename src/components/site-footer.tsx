import Link from "next/link";
import { BUSINESS, SERVICES } from "@/lib/business";

/* Inline rather than lucide-react: this version of lucide has dropped brand
   glyphs (`Facebook` / `Instagram` no longer exist as exports), and a brand
   mark should be the real mark anyway. Both are aria-hidden — the accessible
   name lives on the anchor. */
function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

export function SiteFooter() {
  const { address } = BUSINESS;
  return (
    <footer className="border-t border-line/40 bg-sink">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-data text-[11px] uppercase tracking-[0.09em] text-ink">
              Florida Green Improvements
            </p>
            <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-mute">
              A licensed Florida general contractor working across impact glazing, interior
              renovation and outdoor living in Miami-Dade and Broward.
            </p>
            {/* Was one long uppercase line that ran the full column width and
                read as fine print. Two lines, boxed, and the licence number
                in ink — it is the single strongest credibility signal on the
                page and was the least prominent thing in the footer. */}
            <div className="mt-8 inline-block border-l-2 border-amber pl-4">
              <p className="font-data text-[13px] font-medium uppercase tracking-[0.08em] text-ink">
                Licence {BUSINESS.license}
              </p>
              <p className="mt-1 font-data text-[12px] uppercase tracking-[0.08em] text-mute">
                {BUSINESS.licenseLabel}
              </p>
            </div>
          </div>

          <div>
            <p className="u-data mb-6">Services</p>
            <ul className="flex flex-col gap-0.5">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="block py-1.5 text-[15px] text-mute transition-colors hover:text-ink"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="u-data mb-6">Contact</p>
            <address className="not-italic">
              <a
                href={BUSINESS.phoneHref}
                className="block py-1.5 text-[15px] text-ink transition-colors hover:text-brand-yellow"
              >
                {BUSINESS.phone}
              </a>
              <span className="mt-4 block text-[15px] leading-relaxed text-mute">
                {address.street}
                <br />
                {address.locality}, {address.region} {address.postalCode}
              </span>
            </address>
            {/* Icons rather than the words. The visible label is gone, so each
                link carries an aria-label — an icon-only link with no
                accessible name is announced as just "link" by a screen reader.
                44px boxes: these were 19px text targets. */}
            <ul className="mt-8 flex items-center gap-2">
              <li>
                <a
                  href={BUSINESS.social.instagram}
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label="Florida Green Improvements on Instagram"
                  className="btn-icon border-line text-mute transition-colors hover:border-ink hover:text-ink"
                >
                  <InstagramMark />
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.social.facebook}
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label="Florida Green Improvements on Facebook"
                  className="btn-icon border-line text-mute transition-colors hover:border-ink hover:text-ink"
                >
                  <FacebookMark />
                </a>
              </li>
            </ul>
            <Link
              href="/contact"
              className="mt-4 inline-block py-1.5 text-[15px] text-mute transition-colors hover:text-ink"
            >
              Request a quote
            </Link>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-5 border-t border-line/40 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="u-data">
            © {new Date().getFullYear()} {BUSINESS.legalName}
          </p>
          <p className="u-data">
            {BUSINESS.rating.value.toFixed(1)} ★ · {BUSINESS.rating.count} Google reviews
          </p>
          <p className="u-data">
            Site by{" "}
            <a
              href="https://switchcasestudio.com"
              target="_blank"
              rel="noopener"
              className="text-ink-2 underline decoration-line underline-offset-4 transition-colors hover:text-brand-yellow hover:decoration-brand-yellow"
            >
              Switch Case Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
