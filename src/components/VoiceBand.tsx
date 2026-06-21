import { Check } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'

// pseudo-random but stable bar heights for the waveform
const BARS = [
  0.4, 0.7, 0.45, 0.9, 0.6, 1, 0.5, 0.8, 0.35, 0.7, 0.55, 0.95, 0.45, 0.75,
  0.6, 0.85, 0.4, 0.65, 0.5, 0.9, 0.45, 0.7,
]

const TRANSCRIPT = [
  {
    who: 'agent',
    line: "thanks for calling, i'm the automated assistant for {business}. i can book you in or get a person on the line.",
  },
  { who: 'caller', line: 'do you have anything saturday morning?' },
  {
    who: 'agent',
    line: 'yes, 9:40am is open with maria. want me to book it?',
  },
]

const REASSURE = [
  'Inbound only, never outbound AI calls to your customers (TCPA & Michigan SB 351 safe).',
  'Never invents a price or an hour, answers only from facts you keep current.',
  "'Talk to a person' always one ask away.",
]

export default function VoiceBand() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section id="voice" className="bg-ink-base">
      <div ref={ref} className={`band-reveal bg-ink-base ${shown ? 'is-in' : ''}`}>
        <div className="band-content mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 sm:py-28 lg:py-32">
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-gold-soft">
            24/7 · inbound only · AI-disclosed
          </p>

          {/* Centered statement panel, the "I am…" treatment */}
          <div className="mt-6 rounded-[18px] border border-line bg-panel px-7 py-12 text-center sm:px-12 sm:py-16">
            <h2
              className="mx-auto max-w-3xl font-display font-normal text-cream"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', lineHeight: 0.98, letterSpacing: '-0.03em' }}
            >
              While you&rsquo;re closed, it{' '}
              <strong className="font-semibold text-fg">still answers</strong>.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
              <strong className="font-medium text-cream">Every inbound call</strong> gets picked up, never
              voicemail. It greets callers in your brand, discloses up front that it&rsquo;s an
              automated assistant, <strong className="font-medium text-cream">books appointments</strong> into
              your calendar, answers hours, services, and location strictly from your own details,
              and instantly transfers to a real person the moment someone asks.
            </p>

            {/* waveform */}
            <div
              className="mx-auto mt-10 flex h-16 max-w-md items-center justify-center gap-1.5"
              aria-hidden
            >
              {BARS.map((h, i) => (
                <span
                  key={i}
                  className="wave-bar w-1 rounded-full bg-cream"
                  style={{
                    height: `${Math.round(h * 100)}%`,
                    animationDelay: `${(i % 8) * 0.09}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left, reassurances */}
            <div>
              <ul className="space-y-3">
                {REASSURE.map((r) => (
                  <li
                    key={r}
                    className="flex gap-3 text-sm leading-relaxed text-muted"
                  >
                    <Check size={18} className="mt-0.5 shrink-0 text-gold" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-8 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                Always on · answers in your name · books the appointment
              </p>

              <a
                href="#book"
                className="liquid-glass press-cta mt-10 inline-flex items-center gap-2 rounded-full px-9 py-4 text-base font-medium text-cream"
              >
                Hear it on your business <span className="cta-arrow">&rarr;</span>
              </a>
            </div>

            {/* Right, transcript panel (glass/dark) */}
            <div className="rounded-[18px] border border-line bg-panel p-6 sm:p-8">
              <div className="mb-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-gold-soft">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-gold" />
                  live call
                </span>
                <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  automated assistant, disclosed
                </span>
              </div>
              <div className="space-y-4">
                {TRANSCRIPT.map((t, i) => (
                  <div key={i} className="font-mono text-sm leading-relaxed">
                    <span
                      className={`mr-2 uppercase tracking-[0.12em] ${
                        t.who === 'agent' ? 'text-cream' : 'text-muted'
                      }`}
                    >
                      {t.who}:
                    </span>
                    <span className="text-fg">{t.line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
