import { Globe, PhoneCall, LifeBuoy, Check, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'

interface Product {
  name: string
  icon: LucideIcon
  price: string
  unit: string
  /** small secondary price, e.g. a recurring "+ $500 / mo" on a setup fee */
  sub?: string
  /** muted note under the price, e.g. a range ceiling */
  priceNote?: string
  desc: string
  features?: string[]
  /** Optional tiered breakdown (e.g. Website base vs full build), shown as
      labeled groups so what each price gets is unambiguous. */
  tiers?: { label: string; features: string[] }[]
  featured?: boolean
}

// Flagship product, rendered as the large featured card.
const WEBSITE: Product = {
  name: 'Website',
  icon: Globe,
  price: '$750',
  unit: 'one-time',
  priceNote: 'up to $2,500 for a full custom + SEO build',
  desc: 'From a fast one-page site to a full custom build engineered to actually rank on Google, not just look good.',
  featured: true,
  tiers: [
    {
      label: 'Base build',
      features: [
        'Custom, on-brand one-page site',
        'Your own domain, built to load fast',
        'Mobile-friendly, built to bring in customers',
      ],
    },
    {
      label: 'Full custom + SEO build',
      features: [
        'Everything in Base',
        'Full multi-page site',
        'Built to rank in local search',
        'Pages for the areas you serve',
        'Google Business Profile set up',
        'Engineered to rank on Google',
      ],
    },
  ],
}

// Supporting products, stacked beside the flagship.
const PRODUCTS: Product[] = [
  {
    name: 'Voice receptionist',
    icon: PhoneCall,
    price: '$4,000',
    unit: 'setup',
    sub: '+ $500 / mo',
    desc: 'A 24/7 AI receptionist that answers every inbound call in your name and books the appointment.',
    features: [
      'Answers every inbound call',
      'Books into your calendar',
      'Hands off to a human on request',
      'Inbound calls only, fully compliant',
    ],
  },
  {
    name: 'Care plan',
    icon: LifeBuoy,
    price: '$600',
    unit: 'per month',
    desc: 'Optional. Keeps everything ranking, online, and completely hands-off after launch.',
    features: [
      'Hosting, edits, backups',
      'Uptime monitoring',
      'Search ranking checks',
      'Priority support across everything',
    ],
  },
]

function DemoButton({ featured }: { featured?: boolean }) {
  return (
    <a
      href="#book"
      className={`press-cta group/btn mt-auto inline-flex w-full items-center justify-between gap-3 rounded-full px-5 py-3 text-sm font-medium transition-colors ${
        featured
          ? 'bg-gold text-ink-base hover:bg-gold-soft'
          : 'border border-line text-cream hover:border-gold/60'
      }`}
    >
      Book a free demo
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
          featured ? 'border-ink-base/40' : 'border-line group-hover/btn:border-gold/60'
        }`}
      >
        <ArrowRight size={13} />
      </span>
    </a>
  )
}

function ProductCard({ p }: { p: Product }) {
  const Icon = p.icon
  return (
    <div
      className={`relative flex flex-col rounded-[18px] p-7 sm:p-8 ${
        p.featured
          ? 'bg-gradient-to-b from-gold/[0.16] via-gold/[0.05] to-transparent ring-2 ring-gold/55 shadow-[0_0_70px_-20px_rgba(201,162,75,0.5)]'
          : 'border border-line bg-white/[0.015]'
      }`}
    >
      {p.featured && (
        <span className="absolute right-7 top-7 rounded-full border border-gold/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gold-soft">
          Most picked
        </span>
      )}

      <div className="flex items-center gap-2.5">
        <Icon size={17} className="text-gold-soft" />
        <span className="text-sm font-medium text-gold-soft">{p.name}</span>
      </div>

      <p className="mt-6 text-base leading-relaxed text-muted">{p.desc}</p>

      {p.tiers ? (
        <div className="mt-7 space-y-6">
          {p.tiers.map((tier) => (
            <div key={tier.label}>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-gold-soft">
                {tier.label}
              </p>
              <ul className="space-y-3">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm text-cream">
                    <Check size={15} className="mt-0.5 shrink-0 text-gold" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className="mb-8 mt-7 space-y-3">
          {p.features?.map((feat) => (
            <li key={feat} className="flex items-start gap-2.5 text-sm text-cream">
              <Check size={15} className="mt-0.5 shrink-0 text-gold" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      )}

      {p.featured && <SitePreview />}

      <DemoButton featured={p.featured} />
    </div>
  )
}

// Grows (flex-1) to fill the flagship card so its bottom lines up with the
// stacked right column. Turns the otherwise-empty space into a product preview.
function SitePreview() {
  return (
    <div className="mb-8 mt-8 flex min-h-[150px] flex-1 flex-col overflow-hidden rounded-xl border border-line bg-ink-base/50">
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
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-4 w-2/3 rounded bg-cream/15" />
        <div className="h-2.5 w-1/2 rounded bg-white/10" />
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="h-14 rounded-lg bg-white/[0.05]" />
          <div className="h-14 rounded-lg bg-white/[0.05]" />
          <div className="h-14 rounded-lg bg-gold/20" />
        </div>
        <div className="mt-auto space-y-2 pt-2">
          <div className="h-2.5 w-3/4 rounded bg-white/10" />
          <div className="h-2.5 w-2/3 rounded bg-white/10" />
        </div>
      </div>
    </div>
  )
}

export default function ServicesList() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section id="services" className="bg-ink-base pt-16 pb-28 sm:pt-20 sm:pb-32 lg:pt-24 lg:pb-40">
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
            <span className="text-cream">Built around your business.</span>
          </h2>
        </div>

        {/* Bento: flagship Website on the left, Voice receptionist + Care plan
            stacked on the right. items-start keeps each its natural height (no
            stretch = no void). Mobile collapses to a single-column stack. */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 md:items-stretch">
          <ProductCard p={WEBSITE} />
          <div className="grid gap-6 md:grid-rows-2">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.name} p={p} />
            ))}
          </div>
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center font-mono text-xs leading-relaxed tracking-[0.02em] text-muted">
          Every project starts with a free demo built for your business. You only
          pay once you have seen it and want it live.
        </p>
      </div>
    </section>
  )
}
