import { useReveal } from '../hooks/useReveal'

const STEPS = [
  {
    n: '01',
    title: 'Find',
    desc: 'A free lead engine scans the local market and scores real gaps (no site, phone-only, no booking).',
  },
  {
    n: '02',
    title: 'Build the demo first',
    desc: 'A bespoke, on-brand site + a tailored receptionist config, before any sales call.',
  },
  {
    n: '03',
    title: 'Reach out',
    desc: 'Always leading with the live demo link, never a pitch. One-to-one, the first 30 days.',
  },
  {
    n: '04',
    title: 'Close',
    desc: 'A 10–30 min consult: open the demo on your phone, name the cost of missed after-hours calls, quote the path.',
  },
  {
    n: '05',
    title: 'Deliver the website',
    desc: 'Domain, ranking build, GA4 + Search Console + Google Business Profile, live and indexable.',
  },
  {
    n: '06',
    title: 'Deliver the receptionist',
    desc: 'Fill the knowledge base, provision Twilio + Vapi, set transfer line + Calendly, test the full flow.',
  },
  {
    n: '07',
    title: 'Prove & retain',
    desc: 'Monthly reports on calls handled, bookings made, traffic. Data earns the next sale.',
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
