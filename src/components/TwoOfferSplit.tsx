import { useReveal } from '../hooks/useReveal'

export default function TwoOfferSplit() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section id="offer" className="bg-ink-base pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20">
      <div
        ref={ref}
        className={`reveal mx-auto w-full max-w-6xl px-6 sm:px-8 ${shown ? 'is-in' : ''}`}
      >
        <p className="mb-12 font-mono text-[12px] uppercase tracking-[0.18em] text-gold-soft">
          What we build
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left, Websites */}
          <div className="pb-12 md:pb-0 md:pr-12 lg:pr-16">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold">
              01
            </p>
            <h3
              className="mt-4 font-display font-normal text-cream"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1.02 }}
            >
              Websites that <em className="italic text-fg">rank</em>
            </h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              Fast, mobile-friendly, on-brand sites on your own domain, built
              as a real ranking search build (silo + schema + local-area pages +
              Google Business Profile), not just a pretty page.
            </p>
            <a
              href="#services"
              className="ink-underline mt-6 inline-flex items-center gap-1 text-sm font-medium text-cream"
            >
              See the website ladder <span className="text-gold">&rarr;</span>
            </a>
          </div>

          {/* Right, AI Receptionist */}
          <div className="border-t border-line pt-12 md:border-l md:border-t-0 md:pl-12 md:pt-0 lg:pl-16">
            <div className="flex items-center gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold">
                02
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-panel px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gold-soft">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                live · 24/7
              </span>
            </div>
            <h3
              className="mt-4 font-display font-normal text-cream"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1.02 }}
            >
              A 24/7 AI <em className="italic text-fg">receptionist</em>
            </h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              A Vapi-powered assistant that answers every inbound call around the
              clock, books appointments into your calendar, answers
              hours/services from your knowledge base, and hands off to a human
              the moment a caller asks.
            </p>
            <a
              href="#voice"
              className="ink-underline mt-6 inline-flex items-center gap-1 text-sm font-medium text-cream"
            >
              Hear how it works <span className="text-gold">&rarr;</span>
            </a>
          </div>
        </div>

        <p
          className="mt-10 font-display font-normal text-cream"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.05 }}
        >
          <em className="italic text-fg">One person</em>, sketch to launch.
        </p>
      </div>
    </section>
  )
}
