import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { BUSINESS } from "@/lib/business";

export default function NotFound() {
  return (
    <>
      <main id="main" className="mx-auto flex min-h-[76svh] max-w-[1400px] flex-col justify-center px-6 py-32 md:px-10">
        <p className="u-data mb-7 text-green">404</p>
        <h1 className="max-w-[16ch] text-[clamp(2.25rem,7vw,5rem)] text-ink">This page is not here</h1>
        <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-mute">
          The link may be out of date. Everything we do is on the homepage, or call us and we will point you at it.
        </p>
        <div className="mt-11 flex flex-wrap gap-4">
          <Link href="/" className="bg-brass px-8 py-4 font-data text-[10px] font-medium uppercase tracking-[0.2em] text-ground">Back to home</Link>
          <a href={BUSINESS.phoneHref} className="border border-line px-8 py-4 font-data text-[10px] uppercase tracking-[0.2em] text-ink">{BUSINESS.phone}</a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
