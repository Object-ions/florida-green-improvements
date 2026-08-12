import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Star } from "lucide-react";
import { SiteNav, CallBar } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { BUSINESS, SERVICES, getService } from "@/lib/business";
import { serviceSchema, breadcrumbSchema, JsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.title,
      description: service.description,
      url: `/services/${service.slug}`,
      type: "website",
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: service.name, path: `/services/${service.slug}` },
        ])}
      />
      <SiteNav />

      <main id="main">
        {/* ── HERO — his own image, migrated in its existing context ── */}
        <section className="relative flex min-h-[68svh] items-end overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={service.hero}
              alt=""
              fill
              priority
              sizes="100vw"
              quality={74}
              className="object-cover opacity-[1] [filter:saturate(1.04)_contrast(1.03)]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(250,250,248,.76)_0%,rgba(250,250,248,.18)_38%,transparent_72%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[44%] bg-[linear-gradient(to_top,rgba(250,250,248,.86)_0%,rgba(250,250,248,.46)_32%,transparent_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(100%_75%_at_82%_18%,rgba(39,107,74,.13),transparent_66%)] mix-blend-multiply" />
          </div>

          <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 pt-40 md:px-10 md:pb-24">
            
              <nav aria-label="Breadcrumb" className="mb-7">
                <ol className="flex items-center gap-3 font-data text-[12px] uppercase tracking-[0.1em] text-mute">
                  <li>
                    <Link href="/" className="transition-colors hover:text-ink">Home</Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li className="text-green">{service.name}</li>
                </ol>
              </nav>
            
            <h1 className="max-w-[16ch] text-[clamp(2.25rem,7vw,5.5rem)] text-ink">
                {service.name}
              </h1>
            
          </div>
        </section>

        {/* ── INTRO ──────────────────────────────────────────────── */}
        <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
          <div className="grid gap-14 md:grid-cols-[132px_1fr]">
            <Reveal>
              <p className="u-data md:pt-2">Overview</p>
            </Reveal>
            <Reveal delay={120}>
              <p className="max-w-[60ch] text-[19px] leading-[1.7] text-ink-2 md:text-[21px]">
                {service.intro}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Licensed aspirational photography. Deliberately carries no
             caption or alt text implying it is a completed client project. ── */}
        <section className="border-t border-line/40">
          <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
            <Reveal>
              <figure className="grid gap-8 md:grid-cols-[132px_1fr] md:gap-14">
                <figcaption className="u-data md:pt-2">{service.name}</figcaption>
                <div className="relative aspect-[16/10] w-full overflow-hidden border border-line/60">
                  <Image
                    src={`/showcase/${service.slug}.jpg`}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 900px"
                    quality={82}
                    className="object-cover [filter:saturate(.9)_contrast(1.04)]"
                  />
                </div>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* ── POINTS ─────────────────────────────────────────────── */}
        <section className="border-t border-line/40">
          <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
            <Reveal>
              <p className="u-data mb-14">Detail</p>
            </Reveal>
            <div className="grid gap-14 md:grid-cols-3 md:gap-12">
              {service.points.map((p, i) => (
                <Reveal key={p.title} delay={i * 140}>
                  <div className="border-t border-line pt-7">
                    <p className="font-data text-[12px] uppercase tracking-[0.08em] text-green">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-5 text-[clamp(1.375rem,2.4vw,1.875rem)] text-ink">{p.title}</h2>
                    <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-mute md:text-[16px]">
                      {p.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-t border-line/40">
          <div className="absolute inset-0">
            <Image
              src="/atmosphere/glass-facade.jpg"
              alt=""
              fill
              sizes="100vw"
              quality={45}
              className="object-cover opacity-[0.2] [filter:grayscale(.3)]"
            />
          </div>
          <div className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
            <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-end">
              <Reveal>
                <p className="u-data mb-6">Free estimate</p>
                <h2 className="max-w-[18ch] text-[clamp(1.875rem,5vw,3.75rem)] text-ink">
                  Talk to us about your {service.name.toLowerCase()} project
                </h2>
                <p className="mt-7 flex items-center gap-2 font-data text-[12px] uppercase tracking-[0.1em] text-mute">
                  <Star size={12} strokeWidth={0} fill="currentColor" className="text-amber-text" aria-hidden />
                  {BUSINESS.rating.value.toFixed(1)} · {BUSINESS.rating.count} Google reviews ·
                  Licence {BUSINESS.license}
                </p>
              </Reveal>
              <Reveal delay={160}>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="bg-amber px-8 py-4 font-data text-[12px] font-medium uppercase tracking-[0.1em] text-on-amber transition-opacity hover:opacity-90"
                  >
                    Request a quote
                  </Link>
                  <a
                    href={BUSINESS.phoneHref}
                    className="border border-ink/40 px-8 py-4 font-data text-[12px] uppercase tracking-[0.1em] text-ink transition-colors hover:border-ink"
                  >
                    {BUSINESS.phone}
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── OTHER SERVICES ─────────────────────────────────────── */}
        <section className="border-t border-line/40">
          <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-28">
            <Reveal>
              <p className="u-data mb-10">Also from Florida Green</p>
            </Reveal>
            <ul>
              {others.map((s, i) => (
                <Reveal as="li" key={s.slug} delay={i * 80}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex items-center justify-between gap-6 border-b border-line/40 py-6"
                  >
                    <span className="text-[clamp(1.25rem,2.6vw,1.875rem)] font-display uppercase text-ink transition-colors group-hover:text-amber-text">
                      {s.name}
                    </span>
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.25}
                      aria-hidden
                      className="shrink-0 text-mute transition-all group-hover:translate-x-1 group-hover:text-amber-text"
                    />
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
      <CallBar />
    </>
  );
}
