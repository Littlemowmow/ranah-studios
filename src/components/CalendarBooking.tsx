// Calendly-style booking: service → month calendar → time list → details.
// Runs entirely on the LOCAL slot engine (slots.ts) so it works on the static
// deploy with no backend. Mirrors the chat flow's persistence + .ics + email.
import { useMemo, useState, type FormEvent } from 'react'
import { bookingConfig } from '../booking/bookingConfig'
import {
  type Booking,
  type SlotOption,
  dateFromKey,
  dateKey,
  formatDayLong,
  generateDaySlots,
  getBookings,
  makeBookingId,
  saveBooking,
} from '../booking/slots'
import { downloadICS } from '../booking/ics'
import { notifyOwner } from '../booking/notify'

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

/** 6×7 grid of dates for a month, padded with nulls for leading/trailing days. */
function monthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  const lead = first.getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < lead; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

type Stage = 'pick' | 'details' | 'done'

export default function CalendarBooking() {
  const now = useMemo(() => new Date(), [])
  const config = bookingConfig

  const [serviceId, setServiceId] = useState(config.services[0]?.id ?? '')
  const [view, setView] = useState(() => ({ y: now.getFullYear(), m: now.getMonth() }))
  const [selKey, setSelKey] = useState<string | null>(null)
  const [slot, setSlot] = useState<SlotOption | null>(null)
  const [stage, setStage] = useState<Stage>('pick')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  // ── lead qualification (folded in from the old standalone quote form) ──
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [town, setTown] = useState('')
  const [needs, setNeeds] = useState<string[]>([])
  const [otherNeed, setOtherNeed] = useState('')
  const [budget, setBudget] = useState('')
  // Honeypot: bots fill hidden fields, humans never see this. Filled => silently drop.
  const [trap, setTrap] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)

  const OTHER = 'Other'
  function toggleNeed(opt: string) {
    setNeeds((prev) => (prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]))
  }
  // Combined "looking for" string for storage + email.
  const lookingFor = needs
    .map((n) => (n === OTHER ? otherNeed.trim() : n))
    .filter(Boolean)
    .join(', ')
  const otherOk = !needs.includes(OTHER) || otherNeed.trim().length > 0
  const canSubmit =
    !!slot &&
    name.trim().length > 0 &&
    businessName.trim().length > 0 &&
    EMAIL_RE.test(email) &&
    phone.trim().length >= 7 &&
    needs.length > 0 &&
    otherOk &&
    budget.length > 0 &&
    !submitting

  // Month navigation bounds: this month → the month holding the last bookable day.
  const today0 = startOfDay(now)
  const maxDay = startOfDay(new Date(today0.getTime()))
  maxDay.setDate(today0.getDate() + config.maxDaysAhead)
  const minIdx = today0.getFullYear() * 12 + today0.getMonth()
  const maxIdx = maxDay.getFullYear() * 12 + maxDay.getMonth()
  const viewIdx = view.y * 12 + view.m

  function shiftMonth(delta: number) {
    const next = Math.min(maxIdx, Math.max(minIdx, viewIdx + delta))
    setView({ y: Math.floor(next / 12), m: next % 12 })
  }

  function isBookable(date: Date): boolean {
    const d0 = startOfDay(date)
    if (d0 < today0 || d0 > maxDay) return false
    return generateDaySlots(date, serviceId, config, getBookings(), now).length > 0
  }

  function pickService(id: string) {
    setServiceId(id)
    setSlot(null)
    // A chosen day may have no slots for the other duration — re-validate lazily.
  }

  function pickDay(date: Date) {
    setSelKey(dateKey(date))
    setSlot(null)
  }

  const cells = monthGrid(view.y, view.m)
  const monthLabel = new Date(view.y, view.m, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
  const selDate = selKey ? dateFromKey(selKey) : null
  const slots =
    selDate && isBookable(selDate)
      ? generateDaySlots(selDate, serviceId, config, getBookings(), now)
      : []
  const serviceLabel = config.services.find((s) => s.id === serviceId)?.label ?? ''

  function confirm(e: FormEvent) {
    e.preventDefault()
    if (trap) return // honeypot tripped — drop the bot silently
    if (!canSubmit || !slot) return
    setSubmitting(true)
    const b: Booking = {
      id: makeBookingId(slot.startISO, email),
      serviceId,
      serviceLabel,
      startISO: slot.startISO,
      endISO: slot.endISO,
      name: name.trim(),
      email: email.trim(),
      businessName: businessName.trim(),
      phone: phone.trim(),
      website: website.trim(),
      town: town.trim(),
      lookingFor,
      budget,
      message: message.trim(),
      createdISO: new Date().toISOString(),
    }
    saveBooking(b)
    void notifyOwner(b)
    setBooking(b)
    setSubmitting(false)
    setStage('done')
  }

  function reset() {
    setStage('pick')
    setSelKey(null)
    setSlot(null)
    setName('')
    setEmail('')
    setMessage('')
    setBusinessName('')
    setPhone('')
    setWebsite('')
    setTown('')
    setNeeds([])
    setOtherNeed('')
    setBudget('')
    setBooking(null)
  }

  const inputCls =
    'focus-gold w-full rounded-[12px] border border-line-strong bg-ink-base px-4 py-3 text-sm text-cream placeholder-muted/60 outline-none transition'
  const labelCls = 'mb-1.5 block text-xs font-medium text-cream'
  const chipCls = (active: boolean) =>
    `press-cta rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
      active
        ? 'border-gold bg-gold/10 text-gold-soft'
        : 'border-line-strong text-muted hover:text-cream'
    }`

  return (
    <div className="mt-10 overflow-hidden rounded-[18px] border border-line bg-panel">
      {/* Service selector + tz */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-4">
        {config.services.map((s) => {
          const active = s.id === serviceId
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => pickService(s.id)}
              className={`press-cta rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'border-gold bg-gold/10 text-gold-soft'
                  : 'border-line-strong text-muted hover:text-cream'
              }`}
            >
              {s.label}
            </button>
          )
        })}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-muted-soft">
          {config.timezoneLabel}
        </span>
      </div>

      {stage === 'pick' && (
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_232px]">
          {/* Calendar */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                aria-label="Previous month"
                disabled={viewIdx <= minIdx}
                onClick={() => shiftMonth(-1)}
                className="press-cta flex h-9 w-9 items-center justify-center rounded-full text-cream transition-colors hover:bg-panel-soft disabled:opacity-25"
              >
                &lsaquo;
              </button>
              <span className="font-display text-lg text-cream">{monthLabel}</span>
              <button
                type="button"
                aria-label="Next month"
                disabled={viewIdx >= maxIdx}
                onClick={() => shiftMonth(1)}
                className="press-cta flex h-9 w-9 items-center justify-center rounded-full text-cream transition-colors hover:bg-panel-soft disabled:opacity-25"
              >
                &rsaquo;
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7 text-center font-mono text-[10px] uppercase tracking-wide text-muted-soft">
              {WEEKDAY_LABELS.map((w, i) => (
                <span key={i} className="py-1">
                  {w}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((cell, i) => {
                if (!cell) return <span key={i} />
                const key = dateKey(cell)
                const bookable = isBookable(cell)
                const isSel = key === selKey
                const isToday = key === dateKey(now)
                return (
                  <div key={i} className="flex justify-center">
                    <button
                      type="button"
                      disabled={!bookable}
                      onClick={() => pickDay(cell)}
                      aria-label={formatDayLong(cell)}
                      aria-pressed={isSel}
                      className={`relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors ${
                        isSel
                          ? 'bg-cream font-semibold text-ink-base'
                          : bookable
                            ? 'cursor-pointer text-cream hover:bg-panel-soft'
                            : 'cursor-not-allowed text-muted-soft/40'
                      }`}
                    >
                      {cell.getDate()}
                      {bookable && !isSel && (
                        <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-gold" />
                      )}
                      {isToday && !isSel && (
                        <span className="absolute inset-0 rounded-full ring-1 ring-line-strong" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Time list */}
          <div className="lg:border-l lg:border-line lg:pl-6">
            <p className="mb-3 text-sm font-medium text-cream">
              {selDate ? formatDayLong(selDate) : 'Select a day'}
            </p>
            {!selDate ? (
              <p className="text-sm text-muted">
                Pick a highlighted day to see open times.
              </p>
            ) : slots.length === 0 ? (
              <p className="text-sm text-muted">No times left that day. Try another.</p>
            ) : (
              <div className="flex max-h-[260px] flex-col gap-2 overflow-y-auto pr-1">
                {slots.map((s) => (
                  <button
                    key={s.startISO}
                    type="button"
                    onClick={() => {
                      setSlot(s)
                      setStage('details')
                    }}
                    className="press-cta rounded-[12px] border border-line-strong py-3 text-center text-sm font-medium text-cream transition-colors hover:border-gold/60 hover:text-gold-soft"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {stage === 'details' && slot && selDate && (
        <form onSubmit={confirm} className="p-5 sm:p-7">
          <p className="text-sm text-muted">
            <span className="text-cream">{serviceLabel}</span> ·{' '}
            <span className="text-cream">{formatDayLong(selDate)}</span> at{' '}
            <span className="text-cream">{slot.label}</span>
          </p>
          <p className="mt-1.5 text-xs text-muted-soft">
            A few details so we come prepared with something real for your business.
          </p>

          {/* Honeypot — visually hidden, off the tab order. Bots fill it; humans don't. */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
            placeholder="Leave this empty"
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="bk-name">Your name</label>
              <input id="bk-name" className={inputCls} required value={name}
                onChange={(e) => setName(e.target.value)} placeholder="Jane Cooper" autoComplete="name" />
            </div>
            <div>
              <label className={labelCls} htmlFor="bk-biz">Business name</label>
              <input id="bk-biz" className={inputCls} required value={businessName}
                onChange={(e) => setBusinessName(e.target.value)} placeholder="Cooper Family Dental" autoComplete="organization" />
            </div>
            <div>
              <label className={labelCls} htmlFor="bk-email">Email for your invite</label>
              <input id="bk-email" className={inputCls} required type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="jane@business.com" autoComplete="email" />
            </div>
            <div>
              <label className={labelCls} htmlFor="bk-phone">Phone</label>
              <input id="bk-phone" className={inputCls} required type="tel" value={phone}
                onChange={(e) => setPhone(e.target.value)} placeholder="(313) 555-0148" autoComplete="tel" />
            </div>
            <div>
              <label className={labelCls} htmlFor="bk-web">
                Website or social <span className="text-muted-soft">(optional)</span>
              </label>
              <input id="bk-web" className={inputCls} value={website}
                onChange={(e) => setWebsite(e.target.value)} placeholder="yoursite.com or @handle" autoComplete="url" />
            </div>
            <div>
              <label className={labelCls} htmlFor="bk-town">
                Town / area <span className="text-muted-soft">(optional)</span>
              </label>
              <input id="bk-town" className={inputCls} value={town}
                onChange={(e) => setTown(e.target.value)} placeholder="Ann Arbor, Ypsilanti…" />
            </div>
          </div>

          {/* What are you looking for — required, multi-select + Other */}
          <fieldset className="mt-5">
            <legend className={labelCls}>
              What is your business looking for right now?{' '}
              <span className="text-muted-soft">(pick all that apply)</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {config.lookingForOptions.map((opt) => (
                <button key={opt} type="button" onClick={() => toggleNeed(opt)}
                  aria-pressed={needs.includes(opt)} className={chipCls(needs.includes(opt))}>
                  {opt}
                </button>
              ))}
              <button type="button" onClick={() => toggleNeed(OTHER)}
                aria-pressed={needs.includes(OTHER)} className={chipCls(needs.includes(OTHER))}>
                {OTHER}
              </button>
            </div>
            {needs.includes(OTHER) && (
              <input className={`${inputCls} mt-2.5`} value={otherNeed}
                onChange={(e) => setOtherNeed(e.target.value)}
                placeholder="Tell us what you need…" autoFocus />
            )}
          </fieldset>

          {/* Budget — required, single-select */}
          <fieldset className="mt-5">
            <legend className={labelCls}>Rough budget</legend>
            <div className="flex flex-wrap gap-2">
              {config.budgetOptions.map((b) => (
                <button key={b} type="button" onClick={() => setBudget(b)}
                  aria-pressed={budget === b} className={chipCls(budget === b)}>
                  {b}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-5">
            <label className={labelCls} htmlFor="bk-msg">
              Anything else <span className="text-muted-soft">(optional)</span>
            </label>
            <textarea id="bk-msg" className={`${inputCls} min-h-[88px] resize-y`} value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's the biggest gap right now: being found on Google, missed calls, both?" />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStage('pick')}
              className="px-2 py-2 text-sm text-muted transition-colors hover:text-cream"
            >
              &larr; Back
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="press-cta flex-1 rounded-full bg-cream py-3.5 text-sm font-medium text-ink-base transition-colors hover:bg-fg disabled:opacity-40"
            >
              {submitting ? 'Booking…' : 'Confirm booking'}
            </button>
          </div>
        </form>
      )}

      {stage === 'done' && booking && (
        <div className="p-7 text-center sm:p-9">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-gold-soft" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-display text-2xl text-cream">You&rsquo;re booked.</p>
          <p className="mt-2 text-sm text-muted">
            {booking.serviceLabel} · {formatDayLong(new Date(booking.startISO))} at{' '}
            {slot?.label}
          </p>
          <p className="mt-1 text-sm text-muted">
            We&rsquo;ll email {booking.email} to confirm.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => downloadICS(booking, config)}
              className="press-cta rounded-full bg-cream px-6 py-3 text-sm font-medium text-ink-base transition-colors hover:bg-fg"
            >
              Add to calendar
            </button>
            <button
              type="button"
              onClick={reset}
              className="press-cta rounded-full border border-line-strong px-6 py-3 text-sm text-cream transition-colors hover:border-gold/50"
            >
              Book another
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
