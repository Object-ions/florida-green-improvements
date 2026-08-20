import { NextResponse } from "next/server";
import { BUSINESS, SERVICES } from "@/lib/business";

/**
 * Lead delivery. The old site's form went nowhere we could verify and nothing
 * was ever tracked — so there is no record of a single enquiry (baseline F-04).
 * Every submission here is emailed and fires a GA4 `quote_request` conversion
 * on the client side.
 */

const RESEND_KEY = process.env.RESEND_API_KEY;
const TO = process.env.LEAD_NOTIFICATION_EMAIL;
const FROM = process.env.RESEND_FROM_EMAIL ?? "quotes@mail.switchcasestudio.com";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const phone = String(payload.phone ?? "").trim();
  const service = String(payload.service ?? "").trim();
  const message = String(payload.message ?? "").trim();
  const honeypot = String(payload.company ?? "").trim();

  // Bots fill hidden fields. Humans do not. Return 200 so the bot stops retrying.
  if (honeypot) return NextResponse.json({ ok: true });

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) errors.email = "Please enter a valid email address.";
  if (phone.replace(/\D/g, "").length < 10) errors.phone = "Please enter a phone number we can reach you on.";
  if (message.length < 10) errors.message = "Tell us a little about the project — 10 characters or more.";
  if (service && !SERVICES.some((s) => s.name === service) && service !== "Something else") {
    errors.service = "Please choose a service from the list.";
  }
  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  if (!RESEND_KEY || !TO) {
    console.error("[quote] RESEND_API_KEY or LEAD_NOTIFICATION_EMAIL is not configured.");
    return NextResponse.json(
      { error: `Something went wrong on our side. Please call us on ${BUSINESS.phone}.` },
      { status: 500 },
    );
  }

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 16px;font-size:18px">New quote request — ${esc(service || "General inquiry")}</h2>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 16px 4px 0;color:#666">Name</td><td><strong>${esc(name)}</strong></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666">Email</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666">Phone</td><td><a href="tel:${esc(phone)}">${esc(phone)}</a></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666">Service</td><td>${esc(service || "—")}</td></tr>
      </table>
      <p style="margin:20px 0 6px;color:#666;font-size:13px">Message</p>
      <p style="margin:0;white-space:pre-wrap;font-size:14px">${esc(message)}</p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #eee">
      <p style="margin:0;color:#888;font-size:12px">Sent from floridagreenimprovements.com</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Florida Green Improvements <${FROM}>`,
        to: [TO],
        reply_to: email,
        subject: `Quote request — ${name}${service ? ` · ${service}` : ""}`,
        html,
      }),
    });

    if (!res.ok) {
      console.error("[quote] Resend rejected the send:", res.status, await res.text());
      return NextResponse.json(
        { error: `We could not send that. Please call us on ${BUSINESS.phone}.` },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[quote] Send failed:", err);
    return NextResponse.json(
      { error: `We could not send that. Please call us on ${BUSINESS.phone}.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
