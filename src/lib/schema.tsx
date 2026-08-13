import { BUSINESS, SERVICES, type Service } from "./business";

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
    provider: { "@id": `${SITE}/#business` },
    areaServed: BUSINESS.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
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
