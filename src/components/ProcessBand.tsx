import { useReveal } from '../hooks/useReveal'

const STEPS = [
  {
    n: '01',
    title: 'Your demo, first',
    desc: 'A bespoke, on-brand site and a receptionist tuned to your business, built and live before you pay a cent.',
  },
  {
    n: '02',
    title: 'See it on your phone',
    desc: 'Open the real demo link, click around, hear the receptionist answer. No pitch, no pressure.',
  },
  {
    n: '03',
    title: 'Your website goes live',
    desc: 'Your domain, a build made to rank on Google, and your Google Business Profile, live and easy to find.',
  },
  {
    n: '04',
    title: 'Your receptionist goes live',
    desc: 'A 24/7 line that answers in your name, books the appointment, and never drops a call to voicemail.',
  },
  {
    n: '05',
    title: 'We prove it, monthly',
    desc: 'Clear reports on calls handled, bookings made, and traffic won. The results earn the next month.',
  },
]

export default function ProcessBand() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section id="process" className="bg-ink-base">
      <div ref={ref} className={`band-reveal bg-ink-base ${shown ? 'is-in' : ''}`}>
        <div className="band-content mx-auto w-full max-w-6xl px-6 py-28 sm:px-8 sm:py-32 lg:py-40">
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            {/* Left: heading, sticky as the steps scroll past (Giga split) */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-gold-soft">
                How we work
              </p>
              <h2
                className="mt-5 font-display font-normal text-cream"
                style={{ fontSize: 'clamp(2rem, 4.2vw, 3.25rem)', lineHeight: 0.98, letterSpacing: '-0.03em' }}
              >
                Your site is built{' '}
                <em className="italic text-fg">before we ever talk</em>.
              </h2>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
                No deposit, no risk. You see the real thing on your phone, then decide.
              </p>
            </div>

            {/* Right: the numbered steps */}
            <div className="border-t border-line">
              {STEPS.map((s) => (
                <div key={s.n} className="flex gap-5 border-b border-line py-7">
                  <span className="pt-1 font-mono text-sm text-gold">{s.n}</span>
                  <div>
                    <h3 className="font-display text-2xl font-normal text-cream">{s.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
