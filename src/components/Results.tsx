import { useReveal } from '../hooks/useReveal'

// Honest, mechanism-based outcomes (no fabricated client metrics) framed as the
// guarantee. Mirrors the site's promise copy in booking/knowledge.ts.
const OUTCOMES: [string, string][] = [
  ['Every call', 'answered, never voicemail'],
  ['90 days', 'more inbound, or we keep optimizing free'],
  ['Monthly', 'ranking + booking report, in real numbers'],
]

export default function Results() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section id="results" className="bg-ink-base">
      <div ref={ref} className={`band-reveal bg-ink-base ${shown ? 'is-in' : ''}`}>
        <div className="band-content mx-auto w-full max-w-5xl px-6 py-28 sm:px-8 sm:py-32 lg:py-40">
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-gold-soft">
            The promise
          </p>
          <h2
            className="mt-5 max-w-3xl font-display font-normal text-cream"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', lineHeight: 0.98, letterSpacing: '-0.03em' }}
          >
            We make you found, and{' '}
            <em className="italic text-fg">prove it every month</em>.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
            We promise the mechanism, not a number we cannot control. You get the
            exact ranking and booking numbers every month. Not seeing more inbound
            in 90 days? We keep optimizing, free.
          </p>

          <dl className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {OUTCOMES.map(([fig, label]) => (
              <div key={fig} className="rounded-2xl border border-line bg-white/[0.015] p-6">
                <dt className="font-display text-3xl leading-none text-gold-soft">{fig}</dt>
                <dd className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
