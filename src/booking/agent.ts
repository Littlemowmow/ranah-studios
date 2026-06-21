// ─────────────────────────────────────────────────────────────────────────
//  THE BRAIN — a local, scripted conversation engine over the slot engine.
//
//  This is the ONE module you swap to go from scripted → real Claude. It has
//  no React and no I/O: given (state, userText) it returns the assistant's
//  reply, quick-reply chips, and the next state — exactly the shape an
//  @anthropic-ai/sdk tool-loop would produce. To upgrade, replace `respond`
//  with a call to your /api/chat endpoint whose tools are `availableDays`,
//  `generateDaySlots`, and `saveBooking` from slots.ts.
// ─────────────────────────────────────────────────────────────────────────

import type { BookingConfig, Service } from './bookingConfig'
import {
  type Booking,
  type SlotOption,
  availableDays,
  dateFromKey,
  formatDayLong,
  formatTime,
  generateDaySlots,
  getBookings,
  makeBookingId,
} from './slots'
import { matchKnowledge } from './knowledge'

export type ChipKind = 'send' | 'ics' | 'restart'

export interface Chip {
  label: string
  value: string
  kind?: ChipKind
}

export type Stage =
  | 'service'
  | 'day'
  | 'time'
  | 'name'
  | 'email'
  | 'message'
  | 'confirm'
  | 'done'

export interface BrainState {
  stage: Stage
  serviceId?: string
  dateKey?: string
  startISO?: string
  endISO?: string
  name?: string
  email?: string
  message?: string // undefined = not asked yet; '' = skipped
  timePref?: 'morning' | 'afternoon' | 'evening'
  pendingHour?: number
  pendingMinute?: number
}

export interface BrainTurn {
  state: BrainState
  reply: string[]
  chips: Chip[]
  committed?: Booking
}

// ── tiny helpers ───────────────────────────────────────────────────────────

const chip = (label: string, value: string, kind: ChipKind = 'send'): Chip => ({
  label,
  value,
  kind,
})

function service(config: BookingConfig, id?: string): Service | undefined {
  return config.services.find((s) => s.id === id)
}

function isValidEmail(text: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim())
}

// ── natural-language parsing (best-effort; chips guarantee a path) ──────────

function parseService(text: string, config: BookingConfig): string | undefined {
  const t = text.toLowerCase()
  for (const s of config.services) {
    if (t.includes(s.id)) return s.id
    if (t.includes(String(s.minutes))) return s.id
    const firstWord = s.label.toLowerCase().split(/[\s-]/)[0]
    if (firstWord && firstWord.length > 2 && t.includes(firstWord)) return s.id
  }
  if (/\b(quick|intro|hello|hi|chat|short)\b/.test(t)) return config.services[0]?.id
  if (/\b(demo|full|walkthrough|long|deep)\b/.test(t))
    return config.services[1]?.id ?? config.services[0]?.id
  return undefined
}

const WEEKDAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

function parseDay(
  text: string,
  config: BookingConfig,
  now: Date = new Date(),
): string | undefined {
  const t = text.toLowerCase()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  if (/\btoday\b/.test(t)) return keyOf(today)
  if (/\btomorrow\b/.test(t)) {
    const d = new Date(today)
    d.setDate(today.getDate() + 1)
    return keyOf(d)
  }
  for (let i = 0; i < WEEKDAYS.length; i++) {
    const full = WEEKDAYS[i]
    const abbr = full.slice(0, 3)
    if (new RegExp(`\\b(${full}|${abbr})\\b`).test(t)) {
      // soonest occurrence of weekday i, today inclusive, within window
      for (let add = 0; add <= config.maxDaysAhead; add++) {
        const d = new Date(today)
        d.setDate(today.getDate() + add)
        if (d.getDay() === i) return keyOf(d)
      }
    }
  }
  return undefined
}

function keyOf(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseTimePref(
  text: string,
): 'morning' | 'afternoon' | 'evening' | undefined {
  const t = text.toLowerCase()
  if (/\bmorning\b/.test(t)) return 'morning'
  if (/\b(afternoon|noon)\b/.test(t)) return 'afternoon'
  if (/\b(evening|tonight|late)\b/.test(t)) return 'evening'
  return undefined
}

/**
 * Only parses a time when unambiguous (has a colon or am/pm). Scans every
 * candidate so a leading bare number like the "30" in "30 min demo at 2:30pm"
 * doesn't shadow the real time.
 */
function parseExactTime(text: string): { hour: number; minute: number } | undefined {
  const re = /\b(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)?\b/g
  for (const m of text.toLowerCase().matchAll(re)) {
    const hasColon = m[2] !== undefined
    const ap = m[3]?.replace(/\./g, '')
    if (!hasColon && !ap) continue // bare number — not a time

    let hour = parseInt(m[1], 10)
    const minute = m[2] ? parseInt(m[2], 10) : 0
    if (ap === 'pm' && hour < 12) hour += 12
    if (ap === 'am' && hour === 12) hour = 0
    if (hour > 23 || minute > 59) continue
    return { hour, minute }
  }
  return undefined
}

function inPref(
  minuteOfDay: number,
  pref: BrainState['timePref'],
): boolean {
  if (!pref) return true
  const h = Math.floor(minuteOfDay / 60)
  if (pref === 'morning') return h < 12
  if (pref === 'afternoon') return h >= 12 && h < 17
  return h >= 17
}

function nextStage(s: BrainState): Stage {
  if (!s.serviceId) return 'service'
  if (!s.startISO) return s.dateKey ? 'time' : 'day'
  if (!s.name) return 'name'
  if (!s.email) return 'email'
  if (s.message === undefined) return 'message'
  return 'confirm'
}

// ── presenting the prompt for whatever stage we land on ─────────────────────

function present(s: BrainState, config: BookingConfig, now: Date): BrainTurn {
  const name = config.assistantName
  const svc = service(config, s.serviceId)

  switch (s.stage) {
    case 'service':
      return {
        state: s,
        reply: [
          `hi — i'm ${name} from ${config.studioName}. ask me anything about what we do — ranking websites, the 24/7 AI receptionist, pricing — or i can book you a free call. want a quick intro, or a full demo?`,
        ],
        chips: config.services.map((x) =>
          chip(`${x.label} · ${x.blurb}`, x.id),
        ),
      }

    case 'day': {
      const days = availableDays(s.serviceId!, config, getBookings(), now)
      if (!days.length) {
        return {
          state: s,
          reply: [
            `i'm fully booked for the next ${config.maxDaysAhead} days — email ${config.ownerEmail} and i'll open something up for you.`,
          ],
          chips: [chip('Start over', '__restart__', 'restart')],
        }
      }
      return {
        state: s,
        reply: [
          `great — a ${svc?.label.toLowerCase()}. which day suits you? (all times ${config.timezoneLabel})`,
        ],
        chips: days.slice(0, 8).map((d) => chip(d.label, `day:${d.dateKey}`)),
      }
    }

    case 'time': {
      const date = dateFromKey(s.dateKey!)
      const all = generateDaySlots(date, s.serviceId!, config, getBookings(), now)

      if (!all.length) {
        // Chosen day is closed or full — bounce back to the day picker.
        const reset: BrainState = { ...s, dateKey: undefined, pendingHour: undefined, pendingMinute: undefined }
        reset.stage = 'day'
        const turn = present(reset, config, now)
        return {
          ...turn,
          reply: [
            `${formatDayLong(date)} isn't open, sorry. here's what i've got:`,
            ...turn.reply,
          ],
        }
      }

      // If they named an exact time and it's free, jump straight ahead.
      if (s.pendingHour != null) {
        const target = s.pendingHour * 60 + (s.pendingMinute ?? 0)
        const hit = all.find((sl) => sl.minuteOfDay === target)
        if (hit) {
          const picked: BrainState = {
            ...s,
            startISO: hit.startISO,
            endISO: hit.endISO,
            pendingHour: undefined,
            pendingMinute: undefined,
          }
          picked.stage = nextStage(picked)
          return present(picked, config, now)
        }
      }

      const filtered = all.filter((sl) => inPref(sl.minuteOfDay, s.timePref))
      const list = filtered.length ? filtered : all
      const note =
        s.pendingHour != null
          ? `that exact time's taken — here's what's free on ${formatDayLong(date)}:`
          : filtered.length
            ? `here's ${formatDayLong(date)} — pick a time:`
            : `no ${s.timePref} slots that day, but here's ${formatDayLong(date)}:`
      const cleared: BrainState = { ...s, pendingHour: undefined, pendingMinute: undefined }
      return {
        state: cleared,
        reply: [note],
        chips: [
          ...list.map((sl: SlotOption) => chip(sl.label, `time:${sl.startISO}`)),
          chip('← another day', 'day:__pick__'),
        ],
      }
    }

    case 'name': {
      const when = whenLabel(s)
      return {
        state: s,
        reply: [`perfect — ${when}. who am i booking this for? (your name)`],
        chips: [],
      }
    }

    case 'email':
      return {
        state: s,
        reply: [
          `thanks${s.name ? `, ${firstName(s.name)}` : ''} — what's the best email for your calendar invite and confirmation?`,
        ],
        chips: [],
      }

    case 'message':
      return {
        state: s,
        reply: [
          `got it. anything you'd like me to pass along before the call? (optional — e.g. "hey, i want a demo for my dental practice")`,
        ],
        chips: [chip('Skip', '__skip__')],
      }

    case 'confirm': {
      const when = whenLabel(s)
      return {
        state: s,
        reply: [
          `here's your booking:`,
          `${svc?.label} — ${when}\nfor ${s.name} · ${s.email}${s.message ? `\n“${s.message}”` : ''}`,
          `shall i lock it in?`,
        ],
        chips: [
          chip('Confirm ✓', '__confirm__'),
          chip('Change time', '__change_time__'),
        ],
      }
    }

    case 'done':
      return { state: s, reply: [], chips: [] }
  }
}

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0]
}

function whenLabel(s: BrainState): string {
  if (!s.startISO) return ''
  const start = new Date(s.startISO)
  return `${formatDayLong(start)} at ${formatTime(start)}`
}

// ── public brain interface ──────────────────────────────────────────────────

export function initialTurn(config: BookingConfig, now: Date = new Date()): BrainTurn {
  return present({ stage: 'service' }, config, now)
}

export function respond(
  state: BrainState,
  input: string,
  config: BookingConfig,
  now: Date = new Date(),
): BrainTurn {
  const raw = input.trim()
  const s: BrainState = { ...state }

  // ── machine tokens from chips ───────────────────────────────────────────
  if (raw === '__restart__') return initialTurn(config, now)

  if (raw.startsWith('day:')) {
    const key = raw.slice(4)
    if (key === '__pick__') {
      s.dateKey = undefined
      s.startISO = undefined
      s.stage = 'day'
      return present(s, config, now)
    }
    s.dateKey = key
    s.startISO = undefined
    s.stage = 'time'
    return present(s, config, now)
  }

  if (raw.startsWith('time:')) {
    const startISO = raw.slice(5)
    const slot = findSlot(s, startISO, config, now)
    if (slot) {
      s.startISO = slot.startISO
      s.endISO = slot.endISO
    }
    s.stage = nextStage(s)
    return present(s, config, now)
  }

  // ── knowledge intercept ─────────────────────────────────────────────────
  // If the message is a question about Ranah (pricing, services, emergency,
  // turnaround…), answer it from the baked-in knowledge base, then re-present
  // the current step so the booking flow picks up exactly where it left off.
  // Guarded against machine tokens so chips still drive the flow.
  if (raw && !raw.startsWith('__') && !raw.startsWith('day:') && !raw.startsWith('time:')) {
    const answer = matchKnowledge(raw)
    if (answer) {
      const p = present(s, config, now)
      // At the very start, the answers already nudge toward booking — don't repeat the
      // full greeting. Mid-booking, re-show the current question so the flow resumes.
      const reprompt = state.stage === 'service' ? [] : p.reply
      return { ...p, reply: [...answer, ...reprompt] }
    }
  }

  // ── stage-driven free-text capture ──────────────────────────────────────
  switch (state.stage) {
    case 'service':
    case 'day':
    case 'time': {
      // Rich extraction so "saturday at 2 for a demo" fills several fields.
      const svc = parseService(raw, config)
      if (svc && !s.serviceId) s.serviceId = svc
      else if (svc) s.serviceId = svc

      const pref = parseTimePref(raw)
      if (pref) s.timePref = pref

      const day = parseDay(raw, config, now)
      if (day) {
        s.dateKey = day
        s.startISO = undefined
      }

      const exact = parseExactTime(raw)
      if (exact) {
        s.pendingHour = exact.hour
        s.pendingMinute = exact.minute
      }

      if (!s.serviceId) {
        s.stage = 'service'
        return {
          ...present(s, config, now),
          reply: [
            `let's start with what you'd like — a quick intro or a full demo?`,
          ],
        }
      }
      s.stage = nextStage(s)
      return present(s, config, now)
    }

    case 'name': {
      if (!raw) return present(s, config, now)
      s.name = raw
      s.stage = nextStage(s)
      return present(s, config, now)
    }

    case 'email': {
      if (!isValidEmail(raw)) {
        return {
          state: s,
          reply: [
            `hmm, that doesn't look like an email — mind trying again? (e.g. jane@business.com)`,
          ],
          chips: [],
        }
      }
      s.email = raw.trim()
      s.stage = nextStage(s)
      return present(s, config, now)
    }

    case 'message': {
      s.message = raw === '__skip__' ? '' : raw
      s.stage = nextStage(s)
      return present(s, config, now)
    }

    case 'confirm': {
      if (raw === '__confirm__') return commit(s, config)
      if (raw === '__change_time__') {
        s.startISO = undefined
        s.endISO = undefined
        s.dateKey = undefined
        s.stage = 'day'
        return present(s, config, now)
      }
      return present(s, config, now)
    }

    case 'done':
      // Anything after completion restarts cleanly.
      return initialTurn(config, now)
  }
}

function findSlot(
  s: BrainState,
  startISO: string,
  config: BookingConfig,
  now: Date,
): SlotOption | undefined {
  if (!s.dateKey || !s.serviceId) return undefined
  const slots = generateDaySlots(
    dateFromKey(s.dateKey),
    s.serviceId,
    config,
    getBookings(),
    now,
  )
  return slots.find((sl) => sl.startISO === startISO)
}

function commit(s: BrainState, config: BookingConfig): BrainTurn {
  const svc = service(config, s.serviceId)
  const booking: Booking = {
    id: makeBookingId(s.startISO!, s.email!),
    serviceId: s.serviceId!,
    serviceLabel: svc?.label ?? 'Booking',
    startISO: s.startISO!,
    endISO: s.endISO!,
    name: s.name!,
    email: s.email!,
    message: s.message ?? '',
    createdISO: new Date().toISOString(),
  }
  const done: BrainState = { ...s, stage: 'done' }
  return {
    state: done,
    reply: [
      `you're booked, ${firstName(s.name!)} ✓`,
      `${svc?.label} — ${whenLabel(s)}. i've emailed ${config.studioName} and you'll hear back to confirm. add it to your calendar below so it doesn't slip.`,
    ],
    chips: [
      chip('Add to calendar', '__ics__', 'ics'),
      chip('Book another', '__restart__', 'restart'),
    ],
    committed: booking,
  }
}
