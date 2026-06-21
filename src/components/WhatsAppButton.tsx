import { useEffect, useState } from 'react'
import { bookingConfig } from '../booking/bookingConfig'

/**
 * Floating "chat on WhatsApp" entry point. Opens a WhatsApp chat with Ranah Studios'
 * 24/7 AI agent (products/whatsapp-agent), pre-filled with a first message.
 *
 * Renders nothing until `whatsAppNumber` is set in bookingConfig — so the public site
 * stays clean until the Meta Cloud API number is wired. A pill that introduces itself on
 * first load, then settles into a compact icon you can re-expand on hover.
 */
export default function WhatsAppButton() {
  const { whatsAppNumber, whatsAppPrefill } = bookingConfig
  const [expanded, setExpanded] = useState(false)

  // Brief auto-introduction on load, then collapse — draws the eye without nagging.
  useEffect(() => {
    if (!whatsAppNumber) return
    const inT = setTimeout(() => setExpanded(true), 1200)
    const outT = setTimeout(() => setExpanded(false), 5200)
    return () => {
      clearTimeout(inT)
      clearTimeout(outT)
    }
  }, [whatsAppNumber])

  if (!whatsAppNumber) return null

  const href = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(whatsAppPrefill)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-ink-base shadow-[0_8px_30px_rgba(0,0,0,0.35)] ring-1 ring-black/10 transition-all duration-300 ease-out hover:shadow-[0_10px_40px_rgba(37,211,102,0.45)] motion-safe:hover:-translate-y-0.5"
    >
      <span className="grid h-7 w-7 place-items-center">
        <WhatsAppGlyph />
      </span>
      <span
        className={`overflow-hidden whitespace-nowrap font-body text-sm font-semibold leading-none transition-all duration-300 ease-out ${
          expanded ? 'max-w-[12rem] opacity-100' : 'max-w-0 opacity-0'
        }`}
      >
        Chat with our AI · 24/7
      </span>
    </a>
  )
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.46 1.74 6.4L3.2 28.8l6.56-1.72a12.74 12.74 0 0 0 6.24 1.62h.01c7.06 0 12.8-5.74 12.8-12.8s-5.75-12.7-12.81-12.7zm0 23.04h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.89 1.02 1.04-3.79-.25-.39a10.56 10.56 0 0 1-1.62-5.62c0-5.86 4.77-10.63 10.64-10.63 2.84 0 5.51 1.11 7.52 3.12a10.56 10.56 0 0 1 3.11 7.52c0 5.86-4.77 10.65-10.63 10.65zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54l-.61-.01c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.62 0 1.55 1.13 3.04 1.29 3.25.16.21 2.22 3.39 5.38 4.76.75.32 1.34.51 1.8.66.76.24 1.44.21 1.98.13.6-.09 1.89-.77 2.16-1.52.27-.74.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37z" />
    </svg>
  )
}
