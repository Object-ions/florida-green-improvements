import Link from "next/link";
import { BUSINESS, SERVICES } from "@/lib/business";

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
            <p className="u-data mt-8">
              Licence {BUSINESS.license} · {BUSINESS.licenseLabel}
            </p>
          </div>

          <div>
            <p className="u-data mb-6">Services</p>
            <ul className="flex flex-col gap-2.5">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-[15px] text-mute transition-colors hover:text-ink"
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
                className="block text-[15px] text-ink transition-colors hover:text-amber-text"
              >
                {BUSINESS.phone}
              </a>
              <span className="mt-4 block text-[15px] leading-relaxed text-mute">
                {address.street}
                <br />
                {address.locality}, {address.region} {address.postalCode}
              </span>
            </address>
            <ul className="mt-8 flex flex-col gap-2.5">
              <li>
                <a
                  href={BUSINESS.social.instagram}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-[15px] text-mute transition-colors hover:text-ink"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.social.facebook}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-[15px] text-mute transition-colors hover:text-ink"
                >
                  Facebook
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-[15px] text-mute transition-colors hover:text-ink">
                  Request a quote
                </Link>
              </li>
            </ul>
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
              className="text-ink-2 underline decoration-line underline-offset-4 transition-colors hover:text-amber-text hover:decoration-amber-text"
            >
              Switch Case Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
