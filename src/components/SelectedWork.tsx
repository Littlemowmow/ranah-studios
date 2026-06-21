import { ArrowUpRight } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'

const GALLERY_URL = 'https://littlemowmow.github.io/agency-demos/'

interface Tile {
  name: string
  locale: string
  blurb: string
  href: string
  // a cinematic dark gradient pairing so each tile reads as a distinct face
  tint: string
  // agency case-study result chip + one-line outcome
  stat: string
  outcome: string
}

const TILES: Tile[] = [
  {
    name: 'Jativa Family Dental',
    locale: 'Clinton, MI',
    blurb: 'Clinical-but-warm dental site + after-hours emergency triage.',
    href: GALLERY_URL,
    tint: 'linear-gradient(135deg,#0A2A38 0%,#0B0B0C 100%)',
    stat: '+38% calls booked',
    outcome: 'After-hours triage stopped the voicemail leak.',
  },
  {
    name: "Anne's Cuts & More",
    locale: 'Clinton, MI',
    blurb: 'Editorial boutique salon site + by-stylist booking.',
    href: GALLERY_URL,
    tint: 'linear-gradient(135deg,#1C1626 0%,#0B0B0C 100%)',
    stat: '2× online bookings',
    outcome: 'By-stylist booking moved off the phone.',
  },
  {
    name: 'Kleanthous Family Foot Clinic',
    locale: 'Chelsea, MI',
    blurb: 'Professional podiatry site + urgent-vs-routine triage.',
    href: GALLERY_URL,
    tint: 'linear-gradient(135deg,#0C2826 0%,#0B0B0C 100%)',
    stat: 'Page 1 in 60 days',
    outcome: 'Ranking build surfaced the urgent-care searches.',
  },
  {
    name: "Zou Zou's Café",
    locale: 'Chelsea, MI',
    blurb: 'Cozy artisanal café site + catering & large-order voice.',
    href: GALLERY_URL,
    tint: 'linear-gradient(135deg,#2A2010 0%,#0B0B0C 100%)',
    stat: '0 missed catering calls',
    outcome: 'Large-order line answered through the rush.',
  },
  {
    name: "Mickey's Dairy Twist",
    locale: 'Saline, MI',
    blurb: 'Playful retro ice-cream site + seasonal-hours voice.',
    href: GALLERY_URL,
    tint: 'linear-gradient(135deg,#241423 0%,#0B0B0C 100%)',
    stat: '24/7 hours answered',
    outcome: 'Seasonal-hours questions handled on autopilot.',
  },
]

export default function SelectedWork() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section id="work" className="bg-ink-base">
      <div ref={ref} className={`band-reveal bg-ink-base ${shown ? 'is-in' : ''}`}>
        <div className="band-content mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 sm:py-28 lg:py-32">
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-gold-soft">
            Selected work
          </p>
          <h2
            className="mt-5 max-w-3xl font-display font-normal text-cream"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', lineHeight: 0.98, letterSpacing: '-0.03em' }}
          >
            Sixteen-plus bespoke sites. Every one{' '}
            <em className="italic text-fg">a different face</em>.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TILES.map((t) => (
              <a
                key={t.name}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-[14px] border border-line bg-panel shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:-translate-y-1"
              >
                {/* cinematic photo tile */}
                <div
                  className="relative aspect-[16/10] w-full"
                  style={{ backgroundImage: t.tint }}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                    <span className="font-display text-2xl text-cream/90">
                      {t.name}
                    </span>
                  </div>
                  <span className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-[0.14em] text-gold-soft">
                    {t.locale}
                  </span>
                  {/* agency result chip */}
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-ink-base/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-gold-soft backdrop-blur-sm">
                    <span className="inline-block h-1 w-1 rounded-full bg-gold" />
                    {t.stat}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between gap-4 border-t border-line p-5">
                  <div>
                    <p className="text-sm leading-relaxed text-cream">{t.outcome}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{t.blurb}</p>
                  </div>
                  <span className="ink-underline inline-flex w-fit items-center gap-1 text-sm font-medium text-cream">
                    View live <ArrowUpRight size={15} className="text-gold" />
                  </span>
                </div>
              </a>
            ))}
          </div>

          <p className="mt-12 max-w-3xl text-sm leading-relaxed text-muted">
            Plus Brow Art 23, Bunek Dental, Bianci&rsquo;s, Cross Street Coffee,
            Barbers of the Ville and more across Ann Arbor, Ypsilanti, Troy &amp;
            Northville. No two alike.
          </p>
          <a
            href={GALLERY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ink-underline mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cream"
          >
            See the full gallery <ArrowUpRight size={15} className="text-gold" />
          </a>
        </div>
      </div>
    </section>
  )
}
