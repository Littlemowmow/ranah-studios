import { Globe, TrendingUp, LifeBuoy, Check, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'

interface Tier {
  name: string
  icon: LucideIcon
  price: string
  unit: string
  desc: string
  features: string[]
  highlighted?: boolean
}

const TIERS: Tier[] = [
  {
    name: 'Starter',
    icon: Globe,
    price: '$500',
    unit: 'one-time',
    desc: 'A clean one-page site for a brand-new local business that just needs to exist online, fast.',
    features: [
      'Custom one-page site',
      'Mobile-friendly, on-brand',
      'Your own domain',
      'Built to load fast',
    ],
  },
  {
    name: 'Growth',
    icon: TrendingUp,
    price: '$1,000',
    unit: 'one-time',
    desc: 'A multi-section site built to actually rank and convert, not just look good.',
    highlighted: true,
    features: [
      'Everything in Starter',
      'Multi-section build',
      'Local SEO: silo + schema',
      'Local-area pages',
      'Google Business Profile aligned',
    ],
  },
  {
    name: 'Care Plan',
    icon: LifeBuoy,
    price: '$100',
    unit: 'per month',
    desc: 'Optional. Keeps you ranking and online, completely hands-off after launch.',
    features: [
      'Hosting, edits, backups',
      'Uptime monitoring',
      'Search ranking checks',
      'Priority support',
    ],
  },
]

function DemoButton({ highlighted }: { highlighted?: boolean }) {
  return (
    <a
      href="#quote"
      className={`press-cta group/btn mt-auto inline-flex w-full items-center justify-between gap-3 rounded-full px-5 py-3 text-sm font-medium transition-colors ${
        highlighted
          ? 'bg-gold text-ink-base hover:bg-gold-soft'
          : 'border border-line text-cream hover:border-gold/60'
      }`}
    >
      Book a free demo
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
          highlighted ? 'border-ink-base/40' : 'border-line group-hover/btn:border-gold/60'
        }`}
      >
        <ArrowRight size={13} />
      </span>
    </a>
  )
}

export default function ServicesList() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section id="services" className="bg-ink-base pt-12 pb-24 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
      <div
        ref={ref}
        className={`reveal mx-auto w-full max-w-6xl px-6 sm:px-8 ${shown ? 'is-in' : ''}`}
      >
        {/* Heading */}
        <div className="text-center">
          <h2
            className="font-display font-normal leading-[0.98]"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', letterSpacing: '-0.02em' }}
          >
            <span className="text-gold-soft">Free demo first.</span>
            <br />
            <span className="text-cream">Then plain pricing.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
            No retainers, no surprises. One-time builds you own forever, with an
            optional care plan when you want it hands-off.
          </p>
        </div>

        {/* Tiers */}
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-0 md:overflow-hidden md:rounded-[20px] md:border md:border-line">
          {TIERS.map((t) => {
            const Icon = t.icon
            return (
              <div
                key={t.name}
                className={`relative flex flex-col rounded-[16px] p-7 sm:p-8 md:rounded-none ${
                  t.highlighted
                    ? 'bg-gradient-to-b from-gold/[0.18] via-gold/[0.06] to-transparent ring-2 ring-gold/55 shadow-[0_0_70px_-18px_rgba(201,162,75,0.5)] md:z-10 md:rounded-[16px]'
                    : 'border border-line md:border-0 md:border-r md:border-line md:last:border-r-0'
                }`}
              >
                {t.highlighted && (
                  <span className="absolute right-7 top-7 rounded-full border border-gold/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gold-soft">
                    Most picked
                  </span>
                )}

                <div className="flex items-center gap-2.5">
                  <Icon size={17} className="text-gold-soft" />
                  <span className="text-sm font-medium text-gold-soft">{t.name}</span>
                </div>

                <div className="mt-6 flex items-baseline gap-2">
                  <span
                    className="font-display font-normal leading-none text-cream"
                    style={{ fontSize: 'clamp(2.5rem, 4vw, 3.25rem)' }}
                  >
                    {t.price}
                  </span>
                  <span className="text-sm text-muted">/ {t.unit}</span>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-muted">{t.desc}</p>

                <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  Features:
                </p>
                <ul className="mt-4 mb-8 space-y-3">
                  {t.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-cream">
                      <Check size={15} className="mt-0.5 shrink-0 text-gold" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <DemoButton highlighted={t.highlighted} />
              </div>
            )
          })}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center font-mono text-xs leading-relaxed tracking-[0.02em] text-muted">
          Every project starts with a free demo built for your business. You only
          pay once you have seen it and want it live.
        </p>
      </div>
    </section>
  )
}
