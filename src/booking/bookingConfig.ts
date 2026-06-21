// ─────────────────────────────────────────────────────────────────────────
//  BOOKING CONFIG — the single per-client edit point.
//
//  To re-skin this booking system for another agency: change the values in
//  this file (and the brand tokens in tailwind.config.js). No other file
//  needs to be touched. Hours are interpreted as wall-clock time in the
//  studio's operating timezone (see TIMEZONE NOTE in slots.ts).
// ─────────────────────────────────────────────────────────────────────────

export interface Service {
  id: string
  label: string
  minutes: number
  blurb: string
}

/** 'HH:MM' 24h open/close for a weekday, or null = closed that day. */
export interface DayHours {
  open: string
  close: string
}

/** Indexed by JS weekday: 0 = Sunday … 6 = Saturday. */
export type WeeklyHours = Record<number, DayHours | null>

export interface BookingConfig {
  studioName: string
  /** First-person assistant the visitor chats with. */
  assistantName: string
  /** Where booking notifications are emailed. */
  ownerEmail: string
  /**
   * Web3Forms access key for emailing bookings to the owner.
   * Get a free one in ~2 min at https://web3forms.com (no login). Until set,
   * bookings still save + download an .ics; the owner email is skipped.
   */
  web3FormsAccessKey: string
  /** Display label for the operating timezone, e.g. 'Eastern Time (ET)'. */
  timezoneLabel: string
  /**
   * WhatsApp number for the floating "chat with our AI" button, digits only in
   * E.164 WITHOUT the leading '+' (e.g. '15551234567'). This is the number the
   * WhatsApp agent (products/whatsapp-agent) answers on — paste the Meta Cloud
   * API test number here after setup. Leave '' to hide the button.
   */
  whatsAppNumber: string
  /** Pre-filled first message when a visitor taps the WhatsApp button. */
  whatsAppPrefill: string
  services: Service[]
  weeklyHours: WeeklyHours
  /** Spacing of candidate start times, minutes. */
  slotIntervalMinutes: number
  /** Minimum gap enforced between two bookings, minutes. */
  bufferMinutes: number
  /** A slot must start at least this many hours from now. */
  leadTimeHours: number
  /** How many days out the calendar is bookable. */
  maxDaysAhead: number
}

const WEEKDAY_10_TO_6: DayHours = { open: '10:00', close: '18:00' }

export const bookingConfig: BookingConfig = {
  studioName: 'Ranah Studios',
  assistantName: 'Remi',
  ownerEmail: 'hmuhammadali10@gmail.com',
  // ⤵ paste your Web3Forms access key here to receive booking emails.
  web3FormsAccessKey: 'YOUR_ACCESS_KEY_HERE',
  timezoneLabel: 'Eastern Time (ET)',
  // ⤵ paste the WhatsApp agent's number (Meta Cloud API test number) here, digits only, no '+'.
  whatsAppNumber: '',
  whatsAppPrefill: "Hi Ranah Studios! I'd like to know more about your websites and AI agents.",
  services: [
    {
      id: 'intro',
      label: '15-min intro',
      minutes: 15,
      blurb: 'A quick hello to see if we are a fit.',
    },
    {
      id: 'demo',
      label: '30-min demo',
      minutes: 30,
      blurb: 'A live walkthrough built around your business.',
    },
  ],
  weeklyHours: {
    0: null, // Sunday — closed
    1: WEEKDAY_10_TO_6, // Monday
    2: WEEKDAY_10_TO_6, // Tuesday
    3: WEEKDAY_10_TO_6, // Wednesday
    4: WEEKDAY_10_TO_6, // Thursday
    5: WEEKDAY_10_TO_6, // Friday
    6: null, // Saturday — closed
  },
  slotIntervalMinutes: 30,
  bufferMinutes: 0,
  leadTimeHours: 2,
  maxDaysAhead: 14,
}
