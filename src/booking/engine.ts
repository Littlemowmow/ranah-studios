// ─────────────────────────────────────────────────────────────────────────
//  BOOKING ENGINE CLIENT — talks to the deployed booking-engine
//  (products/booking-engine) which fronts Cal.com → the owner's Google Calendar.
//
//  OPT-IN: only active when bookingConfig.bookingEngineUrl is set to an http(s)
//  URL. Until then engineEnabled() is false and CalendarBooking.tsx keeps its
//  fully-local slot engine + .ics flow — so the static deploy works with no
//  backend, exactly as before.
//
//  Endpoints (see DEPLOY-NETLIFY.md):
//    POST /api/availability { date:'YYYY-MM-DD', timeZone } -> { slots: ISO[] }
//    POST /api/book { name, email, start, timeZone, notes } -> { uid, ... }
// ─────────────────────────────────────────────────────────────────────────

import { bookingConfig } from './bookingConfig'
import { formatTime, type Booking, type SlotOption } from './slots'

export function engineEnabled(): boolean {
  const u = bookingConfig.bookingEngineUrl
  return !!u && /^https?:\/\//.test(u)
}

function base(): string {
  return bookingConfig.bookingEngineUrl.replace(/\/+$/, '')
}

/** The studio's IANA timezone — what the engine/Cal.com computes slots in. */
function tz(): string {
  return bookingConfig.ianaTimeZone || 'America/Detroit'
}

/** Real open slots for a local day, from Cal.com via the engine. Throws on failure. */
export async function fetchEngineSlots(
  dateKey: string,
  serviceMinutes: number,
): Promise<SlotOption[]> {
  const res = await fetch(`${base()}/api/availability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date: dateKey, timeZone: tz() }),
  })
  if (!res.ok) throw new Error(`availability failed (${res.status})`)
  const data: unknown = await res.json()
  const raw = (data as { slots?: unknown })?.slots
  const list: string[] = Array.isArray(raw) ? (raw as string[]) : []
  return list.map((iso) => {
    const start = new Date(iso)
    const end = new Date(start.getTime() + serviceMinutes * 60_000)
    return {
      startISO: iso,
      endISO: end.toISOString(),
      label: formatTime(start),
      minuteOfDay: start.getHours() * 60 + start.getMinutes(),
    }
  })
}

export interface EngineBookResult {
  ok: boolean
  uid?: string
  error?: string
}

/** Create the real Cal.com booking (lands on the owner's Google Calendar). */
export async function bookViaEngine(b: Booking): Promise<EngineBookResult> {
  // Cal.com captures name/email/start; everything else we qualify the lead with
  // gets packed into notes so it shows up on the calendar event.
  const notes = [
    b.businessName && `Business: ${b.businessName}`,
    b.phone && `Phone: ${b.phone}`,
    b.website && `Web/social: ${b.website}`,
    b.town && `Area: ${b.town}`,
    b.lookingFor && `Looking for: ${b.lookingFor}`,
    b.budget && `Budget: ${b.budget}`,
    b.serviceLabel && `Service: ${b.serviceLabel}`,
    b.message && `Notes: ${b.message}`,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const res = await fetch(`${base()}/api/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: b.name,
        email: b.email,
        start: b.startISO,
        timeZone: tz(),
        notes,
      }),
    })
    const data: unknown = await res.json().catch(() => ({}))
    if (!res.ok) {
      const msg = (data as { error?: string })?.error || `booking failed (${res.status})`
      return { ok: false, error: msg }
    }
    return { ok: true, uid: (data as { uid?: string })?.uid }
  } catch (e) {
    return { ok: false, error: String((e as Error)?.message || e) }
  }
}
