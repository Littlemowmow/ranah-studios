# Ranah Studios — Booking System (v1) Design

Date: 2026-06-20
Status: Approved, building

## Goal

A reusable, config-driven demo-booking flow embedded in the Ranah Studios
marketing site (Calendly/Booksy-style). First client = Ranah Studios itself;
architecture must be re-skinnable for other agencies later by swapping one
config file + brand tokens.

## Approved decisions

- **Engine:** Local-first (browser `localStorage`). No backend in v1. Emails each
  booking to the owner via the existing Web3Forms pattern (with `mailto:` fallback
  so it works with zero setup). Upgrade path = Supabase later.
- **Conversation:** Free-text message on the booking → lands in owner inbox →
  reply over email/text. No in-app chat in v1.
- **Placement:** New dedicated `#book` section + "Book a demo" CTAs in nav/hero.
  Existing quote form (`#quote`) stays as a secondary "or just message us" path.
- **Services:** `15-min intro`, `30-min demo`.
- **Availability default:** Mon–Fri 10:00–18:00, America/Detroit, 30-min grid,
  2-hour minimum lead time, 14 days bookable. All one-line config edits.

## Flow (single section, 4 animated steps)

1. **Service** — choose 15-min intro or 30-min demo.
2. **Day** — horizontal strip of next ~14 bookable days; closed/empty days dimmed.
3. **Time** — grid of *free* slots for the chosen day, rendered in the visitor's
   auto-detected timezone. Past, within-lead-time, and already-booked slots removed.
4. **Details + confirm** — name, email/phone, free-text message → confirm.

On confirm:
- Persist the slot to `localStorage` (prevents same-device double-booking).
- Email the booking to the owner (Web3Forms; `mailto:` fallback).
- Success card with booking summary + **"Add to calendar" (.ics)** download.

## Architecture

| File | Role |
|---|---|
| `src/booking/bookingConfig.ts` | Services, weekly hours, slot interval, buffer, lead time, max days ahead, timezone, owner email, Web3Forms key. The single per-client edit point. |
| `src/booking/slots.ts` | Pure functions: free-slot generation, overlap math, `localStorage` read/write. Side-effect-light + testable. |
| `src/booking/ics.ts` | `.ics` calendar-file generator. |
| `src/components/Booking.tsx` | The 4-step UI flow. |
| `App.tsx`, `Navbar.tsx`, `Hero.tsx` | Add `#book` section, repoint CTAs, add scroll-spy id. |

## Design language (must match existing site)

Dark cinematic, rationed gold accent. Tokens: `ink-base`, `panel`, `cream`,
`gold(.soft/.deep)`, `muted`, `line`. Fonts: Instrument Serif (display), Inter
(body), IBM Plex Mono (eyebrows). Reuse `focus-gold`, `press-cta`, `liquid-glass`
utilities. Spring-ish step transitions; press states on slots; gate large motion
on `prefers-reduced-motion`.

## Honest v1 limitations

- Persistence is **per-device** (localStorage) — cross-device double-booking is
  possible until the Supabase upgrade. Owner email is the source of truth.
- No live chat; conversation is over email.

## Verification

`npm run build` → `npm run preview` (:4173) → dogfood full flow with `browse`
(service → day → slot → confirm → .ics), plus mobile + reduced-motion checks.
