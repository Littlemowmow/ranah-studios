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
  /** IANA timezone the booking engine / Cal.com computes slots in, e.g. 'America/Detroit'. */
  ianaTimeZone: string
  /**
   * Deployed booking-engine base URL (products/booking-engine → Cal.com → Google
   * Calendar), e.g. 'https://rana-booking.netlify.app'. Leave '' to keep the fully
   * LOCAL slot engine + .ics flow (no backend). When set, the calendar fetches real
   * availability and creates real bookings. See booking-engine/DEPLOY-NETLIFY.md.
   */
  bookingEngineUrl: string
  /** Cal.com booking link (the part after cal.com/), e.g. 'username' or
      'username/30min'. Powers the live Cal.com embed in the booking section. */
  calLink: string
  /**
   * WhatsApp number for the floating "chat with our AI" button, digits only in
   * E.164 WITHOUT the leading '+' (e.g. '15551234567'). This is the number the
   * WhatsApp agent (products/whatsapp-agent) answers on — paste the Meta Cloud
   * API test number here after setup. Leave '' to hide the button.
   */
  whatsAppNumber: string
  /** Pre-filled first message when a visitor taps the WhatsApp button. */
  whatsAppPrefill: string
  /** Choices for the "What are you looking for?" booking qualifier (multi-select + Other). */
  lookingForOptions: string[]
  /** Budget bands shown in the booking qualifier — the serious-vs-tyre-kicker filter. */
  budgetOptions: string[]
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
  ianaTimeZone: 'America/Detroit',
  // ⤵ paste the deployed booking-engine URL here to go live with Cal.com/Google Calendar.
  //    Leave '' for the local-only slot engine + .ics fallback.
  bookingEngineUrl: '',
  // ⤵ Cal.com booking link (after cal.com/). Live availability + Google Calendar.
  calLink: 'hadi-muhammad-ali-9x3e5f',
  // ⤵ paste the WhatsApp agent's number (Meta Cloud API test number) here, digits only, no '+'.
  whatsAppNumber: '',
  whatsAppPrefill: "Hi Ranah Studios! I'd like to know more about your websites and AI agents.",
  lookingForOptions: [
    'A website that ranks on Google',
    'A 24/7 AI receptionist',
    'Both (website + receptionist)',
    'Not sure yet (need advice)',
  ],
  budgetOptions: ['Under $1,000', '$1,000 – $3,000', '$3,000 – $5,000', '$5,000+', 'Not sure yet'],
  services: [
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
  leadTimeHours: 48, // must book at least 2 days (48h) ahead
  maxDaysAhead: 14,
}
