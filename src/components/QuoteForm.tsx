import { useState, type FormEvent } from 'react'

// ── SETUP (2 min, no login) ─────────────────────────────────────────────
// 1. Go to https://web3forms.com  → enter the email where you want demo
//    requests delivered → they email you a free Access Key.
// 2. Paste that key below, replacing YOUR_ACCESS_KEY_HERE.
// Until then the form falls back to opening the visitor's mail app to
// CONTACT_EMAIL so nothing is broken in the meantime.
const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE'
const CONTACT_EMAIL = 'hmuhammadali10@gmail.com'
// ────────────────────────────────────────────────────────────────────────

interface Fields {
  name: string
  business: string
  contact: string
  town: string
  need: string
  message: string
}

const EMPTY: Fields = {
  name: '',
  business: '',
  contact: '',
  town: '',
  need: 'Both',
  message: '',
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function QuoteForm() {
  const [f, setF] = useState<Fields>(EMPTY)
  const [status, setStatus] = useState<Status>('idle')

  function update(key: keyof Fields) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => setF((prev) => ({ ...prev, [key]: e.target.value }))
  }

  function mailtoFallback() {
    const subject = `Free demo request from ${f.name}${
      f.business ? `, ${f.business}` : ''
    }`
    const body = [
      `Name: ${f.name}`,
      `Business: ${f.business || '-'}`,
      `Phone / email: ${f.contact}`,
      `Town: ${f.town || '-'}`,
      `Needs: ${f.need}`,
      '',
      'Message:',
      f.message || '-',
    ].join('\n')
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!f.name.trim() || !f.business.trim() || !f.contact.trim()) return

    // No key yet → open the visitor's mail client instead of erroring.
    if (WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
      mailtoFallback()
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Free demo request from ${f.name}${
            f.business ? `, ${f.business}` : ''
          }`,
          from_name: 'Ranah Studios website',
          name: f.name,
          business: f.business,
          phone_or_contact: f.contact,
          town: f.town || '-',
          needs: f.need,
          message: f.message || '-',
        }),
      })
      const data = await res.json()
      setStatus(data.success ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputBase =
    'focus-gold w-full rounded-[12px] border border-line-strong bg-panel px-4 py-3 text-sm text-fg placeholder-muted/60 outline-none transition'
  const labelBase = 'mb-1.5 block text-xs font-medium text-cream'

  return (
    <section id="quote" className="bg-ink-base py-24 sm:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-2xl px-6 text-center">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-gold-soft">
          Book a free demo
        </p>
        <h2
          className="mx-auto mt-5 max-w-xl font-display font-normal text-cream"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
          }}
        >
          Tell us the business. We&rsquo;ll send back{' '}
          <em className="italic text-fg">something real</em>.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted">
          No pitch, no upfront cost, just a live demo link for your business,
          usually within a week.
        </p>

        {status === 'sent' ? (
          <div className="mx-auto mt-12 max-w-md rounded-[18px] border border-line bg-panel p-8">
            <p className="font-display text-2xl text-cream">Thank you.</p>
            <p className="mt-2 text-sm text-muted">
              Your request is on its way &mdash; I&rsquo;ll get back to you with
              a real demo link, usually within one business day.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-12 space-y-4 rounded-[18px] border border-line bg-panel p-6 text-left sm:p-8"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelBase}>Your name</label>
                <input
                  className={inputBase}
                  required
                  value={f.name}
                  onChange={update('name')}
                  placeholder="Jane Cooper"
                />
              </div>
              <div>
                <label className={labelBase}>Business name</label>
                <input
                  className={inputBase}
                  required
                  value={f.business}
                  onChange={update('business')}
                  placeholder="Cooper Family Dental"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelBase}>Phone or email</label>
                <input
                  className={inputBase}
                  required
                  value={f.contact}
                  onChange={update('contact')}
                  placeholder="(313) 555-0148 or jane@business.com"
                />
              </div>
              <div>
                <label className={labelBase}>Town</label>
                <input
                  className={inputBase}
                  value={f.town}
                  onChange={update('town')}
                  placeholder="Ann Arbor, Ypsilanti, Chelsea…"
                />
              </div>
            </div>

            <div>
              <label className={labelBase}>What you need</label>
              <select
                className={inputBase}
                value={f.need}
                onChange={update('need')}
              >
                <option>Website</option>
                <option>AI receptionist</option>
                <option>Both</option>
              </select>
            </div>

            <div>
              <label className={labelBase}>
                Anything else <span className="text-muted/70">(optional)</span>
              </label>
              <textarea
                className={`${inputBase} min-h-[110px] resize-y`}
                value={f.message}
                onChange={update('message')}
                placeholder="What's the biggest gap right now, being found on Google, missed calls, both?"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="press-cta inline-flex w-full items-center justify-center gap-2 rounded-full bg-cream px-8 py-4 text-base font-medium text-ink-base transition-colors hover:bg-fg disabled:opacity-60"
            >
              {status === 'sending' ? (
                'Sending…'
              ) : (
                <>
                  Send me my demo <span className="cta-arrow">&rarr;</span>
                </>
              )}
            </button>

            {status === 'error' && (
              <p className="text-center text-sm text-fg">
                Something went wrong. Please email{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="underline underline-offset-4"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            )}
          </form>
        )}

        <p className="mt-8 text-sm text-muted">
          We only take a handful of clients at a time. Inbound only,
          compliance-first. &middot; or email{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="ink-underline font-medium text-cream"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </section>
  )
}
