import { useEffect, useRef, useState, type FormEvent } from 'react'
import { bookingConfig } from '../booking/bookingConfig'
import {
  type BrainState,
  type BrainTurn,
  type Chip,
  initialTurn,
  respond,
} from '../booking/agent'
import { type Booking, saveBooking } from '../booking/slots'
import { downloadICS } from '../booking/ics'
import { notifyOwner } from '../booking/notify'
import { prefersReducedMotion } from '../hooks/useReveal'
import CalendarBooking from './CalendarBooking'

interface Msg {
  id: number
  role: 'assistant' | 'user'
  text: string
}

let MSG_SEQ = 0
const nextId = () => ++MSG_SEQ

function buildSeed(): {
  messages: Msg[]
  chips: Chip[]
  state: BrainState
} {
  const t = initialTurn(bookingConfig)
  return {
    messages: t.reply.map((text) => ({ id: nextId(), role: 'assistant', text })),
    chips: t.chips,
    state: t.state,
  }
}

export default function Booking() {
  const seed = useRef<ReturnType<typeof buildSeed> | null>(null)
  if (!seed.current) seed.current = buildSeed()

  // Calendly-style calendar is the default; Remi chat is one tap away.
  const [mode, setMode] = useState<'calendar' | 'chat'>('calendar')

  const [messages, setMessages] = useState<Msg[]>(seed.current.messages)
  const [chips, setChips] = useState<Chip[]>(seed.current.chips)
  const [brainState, setBrainState] = useState<BrainState>(seed.current.state)
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const lastBooking = useRef<Booking | null>(null)

  const logRef = useRef<HTMLDivElement>(null)
  const pendingTimer = useRef<number | undefined>(undefined)

  // Keep the conversation pinned to the latest message (scoped to the log).
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing, chips])

  useEffect(() => {
    return () => {
      if (pendingTimer.current) window.clearTimeout(pendingTimer.current)
    }
  }, [])

  function applyTurn(turn: BrainTurn) {
    setTyping(false)
    setMessages((prev) => [
      ...prev,
      ...turn.reply.map((text) => ({ id: nextId(), role: 'assistant' as const, text })),
    ])
    setChips(turn.chips)
    setBrainState(turn.state)
    if (turn.committed) {
      lastBooking.current = turn.committed
      saveBooking(turn.committed)
      void notifyOwner(turn.committed)
    }
  }

  function send(value: string, displayText: string) {
    if (typing) return
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text: displayText }])
    setChips([])
    setInput('')

    const turn = respond(brainState, value, bookingConfig)
    const delay = prefersReducedMotion()
      ? 0
      : 420 + Math.min(turn.reply.join('').length * 4, 360)
    setTyping(true)
    pendingTimer.current = window.setTimeout(() => applyTurn(turn), delay)
  }

  function resetChat() {
    if (pendingTimer.current) window.clearTimeout(pendingTimer.current)
    const fresh = buildSeed()
    lastBooking.current = null
    setTyping(false)
    setMessages(fresh.messages)
    setChips(fresh.chips)
    setBrainState(fresh.state)
  }

  function onChip(c: Chip) {
    if (c.kind === 'ics') {
      if (lastBooking.current) downloadICS(lastBooking.current, bookingConfig)
      return
    }
    if (c.kind === 'restart') {
      resetChat()
      return
    }
    send(c.value, c.label)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const v = input.trim()
    if (!v || typing) return
    send(v, v)
  }

  return (
    <section id="book" className="bg-ink-base py-24 sm:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-3xl px-6">
        <div className="text-center">
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-gold-soft">
            Book a demo
          </p>
          <h2
            className="mx-auto mt-5 max-w-xl font-display font-normal text-cream"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.4rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
            }}
          >
            Book your <em className="italic text-fg">demo</em>.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted">
            Pick a time on the calendar, or chat it out with{' '}
            {bookingConfig.assistantName} &mdash; a 15 or 30-minute slot, booked
            in seconds.
          </p>
        </div>

        {/* Mode toggle: Calendly-style calendar vs Remi chat */}
        <div className="mt-9 flex justify-center">
          <div className="inline-flex rounded-full border border-line bg-panel p-1">
            {(
              [
                ['calendar', 'Pick a time'],
                ['chat', `Chat with ${bookingConfig.assistantName}`],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`press-cta rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  mode === m ? 'bg-cream text-ink-base' : 'text-muted hover:text-cream'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {mode === 'calendar' && <CalendarBooking />}

        {mode === 'chat' && (
        <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-[18px] border border-line bg-panel">
          {/* Identity strip */}
          <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
            </span>
            <span className="text-sm font-medium text-cream">
              {bookingConfig.assistantName}
            </span>
            <span className="text-sm text-muted-soft">
              · {bookingConfig.studioName}
            </span>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-muted-soft">
              {bookingConfig.timezoneLabel}
            </span>
          </div>

          {/* Message log */}
          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label="Booking conversation"
            className="flex max-h-[460px] min-h-[380px] flex-col gap-3 overflow-y-auto px-5 py-5"
          >
            {messages.map((m) =>
              m.role === 'assistant' ? (
                <div
                  key={m.id}
                  className="chat-in max-w-[82%] whitespace-pre-line rounded-[16px] rounded-tl-[5px] bg-panel-soft px-4 py-2.5 text-sm leading-relaxed text-cream"
                >
                  {m.text}
                </div>
              ) : (
                <div
                  key={m.id}
                  className="chat-in ml-auto max-w-[82%] whitespace-pre-line rounded-[16px] rounded-tr-[5px] bg-cream px-4 py-2.5 text-sm leading-relaxed text-ink-base"
                >
                  {m.text}
                </div>
              ),
            )}

            {typing && (
              <div
                className="chat-in flex max-w-[82%] items-center gap-1.5 rounded-[16px] rounded-tl-[5px] bg-panel-soft px-4 py-3"
                aria-label={`${bookingConfig.assistantName} is typing`}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="typing-dot h-1.5 w-1.5 rounded-full bg-muted"
                    style={{ animationDelay: `${i * 0.16}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick replies */}
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2 px-5 pb-4">
              {chips.map((c, i) => {
                const primary = c.kind === 'ics' || c.value === '__confirm__'
                return (
                  <button
                    key={`${c.value}-${i}`}
                    type="button"
                    onClick={() => onChip(c)}
                    className={
                      primary
                        ? 'press-cta rounded-full bg-cream px-4 py-2 text-xs font-medium text-ink-base transition-colors hover:bg-fg'
                        : 'press-cta rounded-full border border-line-strong bg-panel-soft px-4 py-2 text-xs text-cream transition-colors hover:border-gold/50'
                    }
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 border-t border-line px-3 py-3"
          >
            <label className="sr-only" htmlFor="booking-input">
              Type a message to {bookingConfig.assistantName}
            </label>
            <input
              id="booking-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`message ${bookingConfig.assistantName}…`}
              autoComplete="off"
              className="focus-gold flex-1 rounded-[12px] bg-transparent px-3 py-2 text-sm text-fg placeholder-muted/60 outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              aria-label="Send message"
              className="press-cta flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-ink-base transition-opacity disabled:opacity-40"
            >
              <span className="cta-arrow">&rarr;</span>
            </button>
          </form>
        </div>
        )}

        <p className="mt-8 text-center text-sm text-muted">
          Prefer to just send a note?{' '}
          <a href="#quote" className="ink-underline font-medium text-cream">
            Use the quick form instead
          </a>
          .
        </p>
      </div>
    </section>
  )
}
