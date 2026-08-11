"use client";

import { useState } from "react";
import { SERVICES } from "@/lib/business";
import { track } from "@/components/analytics";

type Errors = Partial<Record<"name" | "email" | "phone" | "service" | "message" | "form", string>>;

const field =
  "w-full border border-field bg-raise px-4 py-3.5 text-[15px] text-ink placeholder:text-mute " +
  "transition-colors focus:border-green focus:outline-none";
const label = "u-data mb-2.5 block";

export function QuoteForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [started, setStarted] = useState(false);

  function onFirstInput() {
    if (started) return;
    setStarted(true);
    track("form_start", { form: "quote" });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErrors({});

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setState("sent");
        track("form_submit", { form: "quote" });
        track("quote_request", { service: String(data.service ?? "") });
        return;
      }

      const body = await res.json().catch(() => ({}));
      setErrors(body.errors ?? { form: body.error ?? "Something went wrong. Please try again." });
      setState("idle");
    } catch {
      setErrors({ form: "We could not reach the server. Please check your connection and try again." });
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div className="border border-green-deep bg-raise p-10" role="status">
        <p className="u-data mb-4 text-green">Request received</p>
        <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] text-ink">Thank you — we have it.</h2>
        <p className="mt-5 max-w-[44ch] text-[16px] leading-relaxed text-mute">
          We will be in touch shortly to arrange a time to come and look at the work properly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} onInput={onFirstInput} noValidate className="flex flex-col gap-7">
      {errors.form ? (
        <p role="alert" className="border border-line bg-raise px-4 py-3 text-[15px] text-ink">
          {errors.form}
        </p>
      ) : null}

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>Name <span aria-hidden className="text-green">*</span></label>
          <input
            id="name" name="name" type="text" required autoComplete="name"
            className={field} placeholder="Your full name"
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined}
          />
          {errors.name ? <p id="err-name" role="alert" className="mt-2 text-[13px] text-brass-text">{errors.name}</p> : null}
        </div>

        <div>
          <label htmlFor="phone" className={label}>Phone <span aria-hidden className="text-green">*</span></label>
          <input
            id="phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel"
            className={field} placeholder="(786) 000-0000"
            aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "err-phone" : undefined}
          />
          {errors.phone ? <p id="err-phone" role="alert" className="mt-2 text-[13px] text-brass-text">{errors.phone}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="email" className={label}>Email <span aria-hidden className="text-green">*</span></label>
        <input
          id="email" name="email" type="email" required autoComplete="email" inputMode="email"
          className={field} placeholder="you@example.com"
          aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined}
        />
        {errors.email ? <p id="err-email" role="alert" className="mt-2 text-[13px] text-brass-text">{errors.email}</p> : null}
      </div>

      <div>
        <label htmlFor="service" className={label}>What do you need?</label>
        <select id="service" name="service" defaultValue="" className={field}>
          <option value="">Select a service</option>
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.name}>{s.name}</option>
          ))}
          <option value="Something else">Something else</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className={label}>About the project <span aria-hidden className="text-green">*</span></label>
        <textarea
          id="message" name="message" required rows={5} className={`${field} resize-y`}
          placeholder="Roughly what are you planning, and where is the property?"
          aria-invalid={!!errors.message} aria-describedby={errors.message ? "err-message" : "help-message"}
        />
        {errors.message ? (
          <p id="err-message" role="alert" className="mt-2 text-[13px] text-brass-text">{errors.message}</p>
        ) : (
          <p id="help-message" className="mt-2 text-[13px] text-mute">
            A sentence or two is plenty — we will follow up with the detail.
          </p>
        )}
      </div>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-2 self-start bg-brass px-9 py-4 font-data text-[12px] font-medium uppercase tracking-[0.1em] text-on-brass transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {state === "sending" ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
