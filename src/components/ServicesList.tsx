import { Globe, PhoneCall, ShoppingBag, LifeBuoy, Check, ArrowRight } from 'lucide-react'
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
        'Mobile-friendly and conversion-focused',
      ],
    },
    {
      label: 'Full custom + SEO build',
      features: [
        'Everything in Base',
        'Multi-section build',
        'Local SEO: silo + schema',
        'Local-area landing pages',
        'Google Business Profile aligned',
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
      'Inbound only, TCPA / SB 351 safe',
    ],
  },
  {
    name: 'Business ordering system',
    icon: ShoppingBag,
    price: '~$4,000',
    unit: 'setup',
    sub: '+ small monthly',
    desc: 'Let customers order and pay online for pickup or delivery, without tying up the phone.',
    features: [
      'Branded ordering page',
      'Pickup and delivery',
      'Online payments',
      'Menu and order management',
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
        <div className="mb-8 mt-7 space-y-6">
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

      <DemoButton featured={p.featured} />
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

        {/* Staggered grid: left, right, left, right — the right column is offset
            down so the cards interlock. items-start keeps each card its natural
            height (no stretch), so the featured card never leaves a void. */}
        {/* Giga-style stagger: cards alternate left/right at ~half width and pull
            UP to interlock, so the zigzag stays compact and airy instead of
            cascading off the page. Mobile collapses to a full-width stack. */}
        <div className="mt-16 flex flex-col gap-y-8 md:block">
          {[WEBSITE, ...PRODUCTS].map((p, i) => (
            <div
              key={p.name}
              className={`w-full md:w-[48%] ${i % 2 === 1 ? 'md:ml-auto' : ''} ${
                i > 0 ? 'md:-mt-16' : ''
              }`}
            >
              <ProductCard p={p} />
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center font-mono text-xs leading-relaxed tracking-[0.02em] text-muted">
          Every project starts with a free demo built for your business. You only
          pay once you have seen it and want it live.
        </p>
      </div>
    </section>
  )
}
