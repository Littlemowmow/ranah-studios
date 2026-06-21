// ─────────────────────────────────────────────────────────────────────────
//  SLOT ENGINE — pure availability math + localStorage persistence.
//
//  TIMEZONE NOTE: business hours are treated as wall-clock time in the
//  visitor's local timezone, which for a local studio booking local clients
//  equals the studio's timezone (labelled via config.timezoneLabel). This
//  avoids fragile IANA offset/DST math. Stored bookings keep an absolute ISO
//  instant, so the .ics file and email are unambiguous. To serve clients in
//  a different timezone than the studio, upgrade to a tz-aware backend.
// ─────────────────────────────────────────────────────────────────────────

import type { BookingConfig, Service } from './bookingConfig'

export interface Booking {
  id: string
  serviceId: string
  serviceLabel: string
  startISO: string
  endISO: string
  name: string
  email: string
  message: string
  createdISO: string
}

const STORAGE_KEY = 'ranah.bookings.v1'

// ── persistence ──────────────────────────────────────────────────────────

export function getBookings(): Booking[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Booking[]) : []
  } catch {
    return []
  }
}

export function saveBooking(b: Booking): void {
  if (typeof localStorage === 'undefined') return
  const all = getBookings()
  all.push(b)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    /* quota / private mode — booking still lives in memory for this session */
  }
}

// ── small date helpers ─────────────────────────────────────────────────────

/** Local calendar date key, 'YYYY-MM-DD'. */
export function dateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Parse 'YYYY-MM-DD' into a local Date at midnight. */
export function dateFromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function formatDay(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDayLong(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(d: Date): string {
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

// ── slot generation ────────────────────────────────────────────────────────

export interface SlotOption {
  startISO: string
  endISO: string
  /** Local display label, e.g. '2:30 PM'. */
  label: string
  /** Minutes from local midnight — useful for morning/afternoon filtering. */
  minuteOfDay: number
}

export interface DayOption {
  dateKey: string
  date: Date
  label: string
  freeCount: number
}

function getService(config: BookingConfig, serviceId: string): Service | undefined {
  return config.services.find((s) => s.id === serviceId)
}

/** Does [aStart,aEnd) conflict with booking [bStart,bEnd) given a buffer? */
function overlaps(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
  bufferMs: number,
): boolean {
  return aStart < bEnd + bufferMs && aEnd + bufferMs > bStart
}

/** All bookable start times for a given local day + service. */
export function generateDaySlots(
  date: Date,
  serviceId: string,
  config: BookingConfig,
  bookings: Booking[] = getBookings(),
  now: Date = new Date(),
): SlotOption[] {
  const service = getService(config, serviceId)
  if (!service) return []

  const hours = config.weeklyHours[date.getDay()]
  if (!hours) return []

  const open = minutesOf(hours.open)
  const close = minutesOf(hours.close)
  const step = config.slotIntervalMinutes
  const dur = service.minutes
  const bufferMs = config.bufferMinutes * 60_000
  const leadCutoff = now.getTime() + config.leadTimeHours * 3_600_000

  const taken = bookings.map((b) => ({
    start: new Date(b.startISO).getTime(),
    end: new Date(b.endISO).getTime(),
  }))

  const slots: SlotOption[] = []
  for (let m = open; m + dur <= close; m += step) {
    const start = new Date(date)
    start.setHours(0, m, 0, 0)
    const end = new Date(start.getTime() + dur * 60_000)
    const startMs = start.getTime()

    if (startMs < leadCutoff) continue // too soon / in the past

    const clash = taken.some((t) =>
      overlaps(startMs, end.getTime(), t.start, t.end, bufferMs),
    )
    if (clash) continue

    slots.push({
      startISO: start.toISOString(),
      endISO: end.toISOString(),
      label: formatTime(start),
      minuteOfDay: m,
    })
  }
  return slots
}

/** The next `maxDaysAhead` days that have at least one free slot. */
export function availableDays(
  serviceId: string,
  config: BookingConfig,
  bookings: Booking[] = getBookings(),
  now: Date = new Date(),
): DayOption[] {
  const days: DayOption[] = []
  const cursor = new Date(now)
  cursor.setHours(0, 0, 0, 0)

  for (let i = 0; i <= config.maxDaysAhead; i++) {
    const d = new Date(cursor)
    d.setDate(cursor.getDate() + i)
    const free = generateDaySlots(d, serviceId, config, bookings, now)
    if (free.length > 0) {
      days.push({
        dateKey: dateKey(d),
        date: d,
        label: formatDay(d),
        freeCount: free.length,
      })
    }
  }
  return days
}

/** Build a stable-ish booking id without external deps. */
export function makeBookingId(startISO: string, email: string): string {
  return `bk_${startISO.replace(/[^0-9]/g, '').slice(0, 14)}_${email
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 8)}`
}
