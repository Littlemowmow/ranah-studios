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
        <div className="band-content mx-auto w-full max-w-5xl px-6 py-24 sm:px-8 sm:py-28 lg:py-32">
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-gold-soft">
            How we work
          </p>
          <h2
            className="mt-5 max-w-3xl font-display font-normal text-cream"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', lineHeight: 0.98, letterSpacing: '-0.03em' }}
          >
            Your site is built{' '}
            <em className="italic text-fg">before we ever talk</em>.
          </h2>

          <div className="mt-14 border-t border-line">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="grid grid-cols-1 gap-x-6 gap-y-2 border-b border-line py-7 md:grid-cols-12 md:items-baseline"
              >
                <span className="font-mono text-sm text-gold md:col-span-1">
                  {s.n}
                </span>
                <h3 className="font-display text-2xl font-normal text-cream md:col-span-4">
                  {s.title}
                </h3>
                <p className="max-w-xl text-sm leading-relaxed text-muted md:col-span-7">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
