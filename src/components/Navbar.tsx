import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Voice AI', href: '#voice' },
  { label: 'Process', href: '#process' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#book' },
]

// section ids tracked by scroll-spy (order matters for the observer)
const SPY_IDS = ['services', 'voice', 'process', 'faq', 'book']

function Wordmark({ className = '' }: { className?: string }) {
  return (
    <a href="#top" className={`inline-flex items-center ${className}`} aria-label="Ranah Studios">
      <img
        src={`${import.meta.env.BASE_URL}ranah-logo.png`}
        alt="Ranah Studios"
        className="h-8 w-auto sm:h-9"
      />
    </a>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string>('')

  // glass bar once the page leaves the top
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // scroll-spy: underline the section currently in view
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const els = SPY_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    )
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const isActive = (href: string) => href === `#${active}`

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-colors duration-300 ${
          scrolled
            ? 'nav-scrolled border-b border-line'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <Wordmark className="text-2xl sm:text-3xl" />

          {/* Desktop links */}
          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`relative text-sm transition-colors duration-200 ${
                  isActive(l.href)
                    ? 'text-fg'
                    : 'text-muted hover:text-fg'
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[1.5px] bg-gold transition-all duration-300 ${
                    isActive(l.href) ? 'w-full' : 'w-0'
                  }`}
                />
              </a>
            ))}
            <a
              href="#book"
              className="liquid-glass press-cta rounded-full px-5 py-2.5 text-sm font-medium text-cream"
            >
              Book a free demo
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-panel text-cream lg:hidden"
          >
            <Menu size={18} />
          </button>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          open ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 mx-3 mb-3 rounded-[18px] border border-line bg-panel p-8 transition-transform duration-200 ${
            open ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.32,0.72,0,1)' }}
        >
          <div className="mb-8 flex items-center justify-between">
            <Wordmark className="text-2xl" />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-base text-cream"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`font-display text-3xl transition-colors ${
                  isActive(l.href) ? 'text-cream' : 'text-muted'
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <a
            href="#book"
            onClick={() => setOpen(false)}
            className="liquid-glass press-cta mt-8 flex w-full items-center justify-center rounded-full px-6 py-4 text-base font-medium text-cream"
          >
            Book a free demo
          </a>
        </div>
      </div>
    </header>
  )
}
