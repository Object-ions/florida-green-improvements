import { BUSINESS, FAQS, SERVICES, showcaseSrc, type Service } from "./business";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.floridagreenimprovements.com";

/**
 * JSON-LD. The old site carried ZERO structured data on all 15 pages
 * (baseline finding F-03) — which is precisely why a genuine 5.0 rating from
 * 44 reviews has never once appeared as stars in a Google result. The reviews
 * were always there; nothing ever told Google about them.
 */

export function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${SITE}/#business`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: SITE,
    telephone: BUSINESS.phone,
    image: `${SITE}/atmosphere/hero-house-dusk.webp`,
    priceRange: "$$-$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: BUSINESS.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
    openingHoursSpecification: BUSINESS.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS.rating.value,
      reviewCount: BUSINESS.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: BUSINESS.licenseLabel,
      identifier: BUSINESS.license,
    },
    sameAs: [BUSINESS.social.instagram, BUSINESS.social.facebook],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Home improvement services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: `${SITE}/services/${s.slug}` },
      })),
    },
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}/services/${service.slug}/#service`,
    name: service.name,
    description: service.description,
    url: `${SITE}/services/${service.slug}`,
    serviceType: service.name,
    image: `${SITE}${showcaseSrc(service)}`,
    provider: { "@id": `${SITE}/#business` },
    areaServed: BUSINESS.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
  };
}

/**
 * FAQPage, for the FAQ block on the homepage.
 *
 * Emitted only for questions that are actually rendered on the page — Google
 * treats FAQ markup with no visible counterpart as a manual-action offence,
 * and it is the same FAQS array either way, so the two cannot drift.
 *
 * No Review markup ships alongside it. Two of the three Google reviews are
 * shown as exact excerpts, and marking up a truncated quote as a full
 * `reviewBody` is the kind of thing that costs a site its rich results. The
 * AggregateRating in businessSchema() already carries the 5.0 / 44.
 */
export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE}/#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE}${t.path}`,
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
