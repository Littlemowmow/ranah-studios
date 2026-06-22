// LIVE booking widget — backed by the real Cal.com engine (products/booking-engine).
// Calls /api/availability + /api/book, proxied by Vite to the engine on :4321 (see vite.config.ts).
// Mounted at #test-booking (see App.tsx) so it doesn't disturb the existing scripted booking.
import { useEffect, useMemo, useState } from 'react'

const TZ = 'America/Detroit'

function ymd(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}
function nextDays(n: number): Date[] {
  const out: Date[] = []
  const t = new Date()
  for (let i = 0; i < n; i++) {
    const d = new Date(t)
    d.setDate(t.getDate() + i)
    out.push(d)
  }
  return out
}
const dow = (d: Date) => d.toLocaleDateString(undefined, { weekday: 'short' })
const fullDay = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

// Turn a raw booking UID (e.g. "ojKpEUFz1W753vsA3dAeXb") into a clean, human confirmation
// code (e.g. "OJKP-EUFZ") so the success screen reads as intentional, not like leaked noise.
const fmtRef = (uid: string): string => {
  const clean = uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8)
  return clean.length > 4 ? `${clean.slice(0, 4)}-${clean.slice(4)}` : clean
}

async function api<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await r.json()
  if (!r.ok) throw new Error((data as { error?: string }).error || 'request failed')
  return data as T
}

type Step = 'when' | 'details' | 'done'

export default function LiveBooking() {
  const [step, setStep] = useState<Step>('when')
  const [date, setDate] = useState<Date>(nextDays(1)[0])
  const [userPicked, setUserPicked] = useState(false)
  const [slots, setSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotIso, setSlotIso] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')
  const [ref, setRef] = useState('')
  const [mode, setMode] = useState('')

  const days = useMemo(() => nextDays(10), [])

  useEffect(() => {
    let cancelled = false
    setLoadingSlots(true)
    setErr('')
    api<{ slots: string[]; mode: string }>('/api/availability', { date: ymd(date), timeZone: TZ })
      .then((r) => {
        if (cancelled) return
        setMode('')
        // On first load, skip closed/empty days and land on the next open one.
        const idx = days.findIndex((d) => ymd(d) === ymd(date))
        if (r.slots.length === 0 && !userPicked && idx >= 0 && idx < days.length - 1) {
          setDate(days[idx + 1]) // keep the skeletons up; effect refetches for the next day
          return
        }
        setSlots(r.slots)
        setLoadingSlots(false)
      })
      .catch((e: Error) => {
        if (cancelled) return
        setErr(e.message)
        setMode('Booking temporarily unavailable')
        setLoadingSlots(false)
      })
    return () => {
      cancelled = true
    }
  }, [date, userPicked, days])

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)

  async function confirm() {
    if (!slotIso) return
    setSubmitting(true)
    setErr('')
    try {
      const r = await api<{ uid: string }>('/api/book', {
        name,
        email,
        start: slotIso,
        timeZone: TZ,
      })
      setRef(r.uid)
      setStep('done')
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-ink-base font-body text-cream antialiased flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-line bg-panel shadow-2xl overflow-hidden">
        <div className="px-7 pt-7 pb-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold-soft">
            Ranah Studios
          </p>
          <h1 className="mt-2 font-display text-3xl leading-tight text-cream">
            {step === 'done' ? "You're booked" : 'Book a 30-min demo'}
          </h1>
          {step !== 'done' && (
            <p className="mt-1 text-sm text-muted">Pick a date to see open times.</p>
          )}
        </div>

        <div className="px-7 pb-7">
          {step === 'when' && (
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-wide text-muted-soft">Date</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {days.map((d) => {
                  const sel = ymd(d) === ymd(date)
                  return (
                    <button
                      key={ymd(d)}
                      onClick={() => {
                        setUserPicked(true)
                        setDate(d)
                        setSlotIso(null)
                      }}
                      className={`flex-none w-[58px] rounded-xl border px-0 py-2 text-center transition ${
                        sel
                          ? 'border-gold text-gold-soft'
                          : 'border-line text-cream hover:border-line-strong'
                      }`}
                    >
                      <span className="block text-[11px] uppercase text-muted">{dow(d)}</span>
                      <span className="mt-1 block font-semibold">{d.getDate()}</span>
                    </button>
                  )
                })}
              </div>

              <p className="mb-2 mt-5 text-[11px] uppercase tracking-wide text-muted-soft">Time</p>
              {loadingSlots ? (
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-11 animate-pulse rounded-xl bg-panel-soft" />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <p className="text-sm text-muted">No times left that day. Try another date.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((iso) => {
                    const sel = slotIso === iso
                    return (
                      <button
                        key={iso}
                        onClick={() => {
                          setSlotIso(iso)
                          setTimeout(() => setStep('details'), 140)
                        }}
                        className={`rounded-xl border py-3 text-sm font-medium transition active:scale-95 ${
                          sel
                            ? 'border-gold text-gold-soft'
                            : 'border-line text-cream hover:border-line-strong'
                        }`}
                      >
                        {fmtTime(iso)}
                      </button>
                    )
                  })}
                </div>
              )}
              {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
            </div>
          )}

          {step === 'details' && slotIso && (
            <div>
              <p className="mb-4 text-sm text-muted">
                <span className="text-cream">{fullDay(date)}</span> at{' '}
                <span className="text-cream">{fmtTime(slotIso)}</span>
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="mb-3 w-full rounded-xl border border-line-strong bg-ink-base px-4 py-3 text-cream outline-none focus:border-gold"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="mb-3 w-full rounded-xl border border-line-strong bg-ink-base px-4 py-3 text-cream outline-none focus:border-gold"
              />
              <div className="mt-2 flex items-center gap-3">
                <button onClick={() => setStep('when')} className="px-2 py-2 text-muted hover:text-cream">
                  ← Back
                </button>
                <button
                  onClick={confirm}
                  disabled={!name.trim() || !emailOk || submitting}
                  className="flex-1 rounded-xl bg-gold py-3 font-semibold text-ink-base transition hover:bg-gold-deep disabled:opacity-40"
                >
                  {submitting ? 'Booking…' : 'Confirm booking'}
                </button>
              </div>
              {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
            </div>
          )}

          {step === 'done' && slotIso && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-gold" strokeWidth={2.4}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-cream">
                {fullDay(date)} · {fmtTime(slotIso)}
              </p>
              <p className="mt-1 text-sm text-muted">Confirmation sent to {email}</p>
              {ref && (
                <div className="mt-3 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink-base px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-soft">
                    <span className="text-muted-soft/70">Confirmation</span> {fmtRef(ref)}
                  </span>
                </div>
              )}
              <button
                onClick={() => {
                  setStep('when')
                  setSlotIso(null)
                  setName('')
                  setEmail('')
                  setUserPicked(false)
                  setDate(days[0]) // re-probe from today → next open day
                }}
                className="mt-5 w-full rounded-xl bg-gold py-3 font-semibold text-ink-base hover:bg-gold-deep"
              >
                Book another
              </button>
            </div>
          )}
        </div>

        {mode && (
          <div className="border-t border-line px-7 py-3 text-center font-mono text-[10px] uppercase tracking-wide text-muted-soft">
            {mode}
          </div>
        )}
      </div>
    </div>
  )
}
