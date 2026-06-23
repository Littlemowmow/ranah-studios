import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'

const FAQS = [
  {
    q: 'What does Ranah Studios do?',
    a: 'We build local businesses a site that actually ranks and a 24/7 AI receptionist that never misses a call, so you stop being invisible in Google and stop losing revenue to voicemail.',
  },
  {
    q: 'Do I pay anything upfront?',
    a: 'No. We build your demo for free before we even talk. Anything paid only switches on after you’re a client and your site is live.',
  },
  {
    q: 'Will it make outbound calls to my customers?',
    a: 'No. Inbound only, it answers calls that come in. It never makes outbound AI calls to your customers, so you stay fully compliant.',
  },
  {
    q: 'Does it pretend to be a person?',
    a: 'No. It greets in your brand, discloses it’s an automated assistant, books, and hands off to a real person whenever asked. It never invents prices or hours.',
  },
  {
    q: 'Can you guarantee more customers?',
    a: 'We promise the mechanism, not a number we can’t control: we make you found and show you the exact search ranking numbers monthly. Not seeing more inbound in 90 days? We keep optimizing free.',
  },
  {
    q: 'How fast can I be live?',
    a: 'Because the demo is already built, usually within a week of you saying yes.',
  },
  {
    q: 'Who do you work with?',
    a: 'Any business looking to scale and free up time, through automation and a website built to actually get found. We do it across local services, dental, salons, trades, clinics, cafes, auto, and beyond.',
  },
]

export default function FAQ() {
  const { ref, shown } = useReveal<HTMLDivElement>()
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-ink-base py-28 sm:py-32 lg:py-40">
      <div
        ref={ref}
        className={`reveal mx-auto w-full max-w-3xl px-6 sm:px-8 ${shown ? 'is-in' : ''}`}
      >
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-gold-soft">
          Straight answers
        </p>

        <div className="mt-10 border-t border-line">
          {FAQS.map((item, i) => {
            const open = openIdx === i
            return (
              <div
                key={i}
                className={`border-b border-line transition-colors ${
                  open ? 'bg-panel' : ''
                }`}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpenIdx(open ? null : i)}
                    className="flex w-full items-center gap-4 px-1 py-5 text-left sm:px-4"
                  >
                    <span
                      className={`h-5 w-[3px] shrink-0 rounded-full transition-colors ${
                        open ? 'bg-gold' : 'bg-transparent'
                      }`}
                      aria-hidden
                    />
                    <span className="flex-1 font-display text-xl font-normal text-cream sm:text-2xl">
                      {item.q}
                    </span>
                    <span className="shrink-0 text-muted" aria-hidden>
                      {open ? <Minus size={20} /> : <Plus size={20} />}
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  hidden={!open}
                  className="px-1 pb-6 pl-5 pr-2 sm:pl-8 sm:pr-6"
                >
                  <p className="max-w-2xl text-base leading-relaxed text-muted">
                    {item.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
