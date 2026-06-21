// ─────────────────────────────────────────────────────────────────────────
//  ICS — generate + download a calendar file for a confirmed booking.
//  One click adds the meeting to Google / Apple / Outlook calendars.
// ─────────────────────────────────────────────────────────────────────────

import type { BookingConfig } from './bookingConfig'
import type { Booking } from './slots'

/** Format a Date as a UTC iCalendar timestamp: 20260621T143000Z */
function toICSDate(iso: string): string {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

/** Escape per RFC 5545 (commas, semicolons, newlines, backslashes). */
function esc(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

export function buildICS(b: Booking, config: BookingConfig): string {
  const summary = `${b.serviceLabel} with ${config.studioName}`
  const desc =
    `Booked by ${b.name} (${b.email}).` +
    (b.message ? `\nNote: ${b.message}` : '')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${config.studioName}//Booking//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${b.id}@ranahstudios`,
    `DTSTAMP:${toICSDate(b.createdISO)}`,
    `DTSTART:${toICSDate(b.startISO)}`,
    `DTEND:${toICSDate(b.endISO)}`,
    `SUMMARY:${esc(summary)}`,
    `DESCRIPTION:${esc(desc)}`,
    `ORGANIZER;CN=${esc(config.studioName)}:mailto:${config.ownerEmail}`,
    `ATTENDEE;CN=${esc(b.name)};RSVP=TRUE:mailto:${b.email}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  // RFC 5545 wants CRLF line endings.
  return lines.join('\r\n')
}

export function downloadICS(b: Booking, config: BookingConfig): void {
  if (typeof document === 'undefined') return
  const blob = new Blob([buildICS(b, config)], {
    type: 'text/calendar;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${config.studioName.replace(/\s+/g, '-').toLowerCase()}-booking.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
