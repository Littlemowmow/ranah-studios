const NAV_ECHO = [
  { label: 'Services', href: '#services' },
  { label: 'Voice AI', href: '#voice' },
  { label: 'Process', href: '#process' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#quote' },
]

const CONTACT_EMAIL = 'hmuhammadali10@gmail.com'

export default function Footer() {
  return (
    <footer className="bg-ink-base">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-10 lg:flex-row">
          <div className="max-w-md">
            <p className="font-display text-3xl text-cream">
              Ranah <span className="text-muted">·</span> Studios
              <span className="text-muted">, Web &amp; Voice</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              A solo, owner-operated web + inbound-voice-AI studio for
              independent local businesses.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="ink-underline mt-5 inline-block text-sm font-medium text-cream"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV_ECHO.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-muted transition-colors hover:text-cream"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <p className="mt-12 font-mono text-xs leading-relaxed tracking-[0.04em] text-muted">
          Serves · Ann Arbor · Ypsilanti · Chelsea · Clinton · Saline · Troy ·
          Northville &amp; surrounds (Washtenaw County)
        </p>

        <div className="mt-8 border-t border-line pt-6">
          <p className="font-mono text-xs leading-relaxed tracking-[0.04em] text-muted">
            Inbound only · AI-disclosed · CAN-SPAM, TCPA &amp; Michigan SB 351
            safe. &copy; 2026 Ranah Studios.
          </p>
        </div>
      </div>
    </footer>
  )
}
