import { Scissors, Stethoscope, Coffee, Wrench, Car, Store } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Giga-style credibility strip under the hero. Giga uses a client logo cloud;
// for independent local businesses, the trust signal is the industries served.
const INDUSTRIES: { icon: LucideIcon; label: string }[] = [
  { icon: Scissors, label: 'Salons & barbers' },
  { icon: Stethoscope, label: 'Dental & clinics' },
  { icon: Coffee, label: 'Cafes & restaurants' },
  { icon: Wrench, label: 'Trades' },
  { icon: Car, label: 'Auto' },
  { icon: Store, label: 'Local retail' },
]

export default function TrustStrip() {
  return (
    <section className="border-y border-line bg-ink-base/70">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 sm:py-12">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Built for independent local businesses
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-9 gap-y-5 sm:gap-x-12">
          {INDUSTRIES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-muted">
              <Icon size={17} className="text-gold-soft/80" />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center font-mono text-[12px] uppercase tracking-[0.18em] text-gold-soft">
          + more
        </p>
      </div>
    </section>
  )
}
