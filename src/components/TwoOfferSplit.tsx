import { useReveal } from '../hooks/useReveal'
import { openVoiceAgent } from './VoiceAgentWidget'

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
              Websites that <strong className="font-semibold text-fg">rank</strong>
            </h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              Fast, mobile-friendly sites on your own domain, built to actually{' '}
              <strong className="font-medium text-cream">rank on Google</strong> and bring in{' '}
              <strong className="font-medium text-cream">local customers</strong>, not just look pretty.
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
            </div>
            <h3
              className="mt-4 font-display font-normal text-cream"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1.02 }}
            >
              A <strong className="font-semibold text-fg">24/7 AI receptionist</strong>
            </h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              An <strong className="font-medium text-cream">AI-powered assistant</strong> that answers every{' '}
              <strong className="font-medium text-cream">inbound call</strong> around the clock,{' '}
              <strong className="font-medium text-cream">books appointments</strong> into your calendar, answers
              hours and services from your own details, and hands off to a human
              the moment a caller asks.
            </p>
            <button
              type="button"
              onClick={openVoiceAgent}
              className="ink-underline mt-6 inline-flex items-center gap-1 text-sm font-medium text-cream"
            >
              Hear how it works <span className="text-gold">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
