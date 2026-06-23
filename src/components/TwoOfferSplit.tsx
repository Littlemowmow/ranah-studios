import { useReveal } from '../hooks/useReveal'

export default function TwoOfferSplit() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section id="offer" className="bg-ink-base pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28">
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
              Fast, mobile-friendly, on-brand sites on your own domain, built as
              a real <strong className="font-medium text-cream">ranking search build</strong> (silo + schema +{' '}
              <strong className="font-medium text-cream">local-area pages</strong> +{' '}
              <strong className="font-medium text-cream">Google Business Profile</strong>), not just a pretty page.
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
            <a
              href="#book"
              className="ink-underline mt-6 inline-flex items-center gap-1 text-sm font-medium text-cream"
            >
              Hear how it works <span className="text-gold">&rarr;</span>
            </a>
          </div>
        </div>

        {/* Giga-style floating product visuals: layered, depth-shadowed cards that
            make the two offers tangible (a ranking site + a live AI call). */}
        <div className="mt-20 flex flex-col items-center gap-8 sm:mt-24 sm:flex-row sm:items-start sm:justify-center sm:gap-0">
          {/* Site preview */}
          <div className="w-full max-w-[360px] shrink-0 -rotate-2 overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-panel to-ink-base shadow-[0_30px_70px_-24px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="ml-2 flex-1 truncate rounded bg-white/[0.04] px-2 py-1 text-[10px] text-muted">
                yourbusiness.com
              </span>
              <span className="rounded-full border border-gold/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-gold-soft">
                #1 on Google
              </span>
            </div>
            <div className="space-y-3 p-5">
              <div className="h-4 w-2/3 rounded bg-cream/15" />
              <div className="h-2.5 w-1/2 rounded bg-white/10" />
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="h-12 rounded-lg bg-white/[0.05]" />
                <div className="h-12 rounded-lg bg-white/[0.05]" />
                <div className="h-12 rounded-lg bg-gold/20" />
              </div>
              <div className="h-2.5 w-3/4 rounded bg-white/10" />
            </div>
          </div>

          {/* Live call, overlapping for depth */}
          <div className="w-full max-w-[360px] shrink-0 rotate-2 overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-panel to-ink-base shadow-[0_30px_70px_-24px_rgba(0,0,0,0.85)] sm:-ml-10 sm:mt-14">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-gold-soft">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>
                Live call
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">AI · disclosed</span>
            </div>
            <div className="space-y-3 p-4 font-mono text-[11px] leading-relaxed text-muted">
              <p>
                <span className="text-gold-soft">agent</span> thanks for calling, i can book you in or get a person on the line.
              </p>
              <p>
                <span className="text-cream">caller</span> do you have anything saturday morning?
              </p>
              <p>
                <span className="text-gold-soft">agent</span> yes, 9:40am is open. want me to book it?
              </p>
            </div>
          </div>
        </div>

        <p
          className="mt-20 font-display font-normal text-cream sm:mt-24"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.05 }}
        >
          <em className="italic text-fg">One person</em>, sketch to launch.
        </p>
      </div>
    </section>
  )
}
