import { useEffect, useRef } from 'react'
import Navbar from './Navbar'
import { prefersReducedMotion } from '../hooks/useReveal'

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4'

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Native seamless loop (no end-of-clip fade-to-blank). One gentle fade-in.
    if (prefersReducedMotion()) {
      video.style.opacity = '1'
      void video.play().catch(() => {})
      return
    }

    video.style.transition = 'opacity 0.6s ease-out'
    const reveal = () => {
      video.style.opacity = '1'
    }
    video.addEventListener('canplay', reveal, { once: true })
    const t = window.setTimeout(reveal, 500)
    void video.play().catch(() => {})

    return () => {
      video.removeEventListener('canplay', reveal)
      window.clearTimeout(t)
    }
  }, [])

  return (
    // Cinematic gradient fallback so the hero never reads as a dead black box
    // when the background video cannot autoplay (mobile data saver / Low Power).
    <section
      id="top"
      className="relative min-h-screen w-full overflow-hidden bg-navy"
      style={{
        background:
          'radial-gradient(130% 85% at 50% 0%, #0a4256 0%, #04222F 48%, #03161E 100%)',
      }}
    >
      {/* Fullscreen background video, navy base shows in any letterbox */}
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        style={{ opacity: 0 }}
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Subtle bottom vignette for headline legibility, no blobs/radials */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-navy/40 via-transparent to-navy/85" />

      {/* Foreground */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <div className="flex flex-1 flex-col items-center justify-end px-6 pb-24 pt-24 text-center">
          <p className="animate-fade-rise mb-8 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-gold-soft">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
            Ranah &middot; Studios
          </p>

          <h1
            className="animate-fade-rise max-w-7xl font-display font-normal leading-[0.95] tracking-[-2.46px] text-cream text-5xl sm:text-7xl md:text-8xl"
          >
            <strong className="font-semibold text-cream">Websites</strong> worth finding,{' '}
            <em className="not-italic text-muted">
              and a <strong className="font-semibold text-cream">receptionist</strong> that never sleeps.
            </em>
          </h1>

          <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            A solo local studio for independent{' '}
            <strong className="font-semibold text-cream">local businesses</strong>. A site that
            actually <strong className="font-semibold text-cream">ranks in Google</strong>, and a{' '}
            <strong className="font-semibold text-cream">24/7 AI receptionist</strong> that books
            the call instead of dropping it to voicemail.
          </p>

          {/* Thin row of gold-numeral trust stats, agency credibility */}
          <dl className="animate-fade-rise-delay mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-10">
            {[
              ['24/7', 'calls answered'],
              ['1 wk', 'to first demo'],
              ['$0', 'upfront'],
              ['16+', 'bespoke sites'],
            ].map(([fig, label]) => (
              <div key={label} className="flex items-baseline gap-2">
                <dt className="font-display text-2xl leading-none text-gold-soft sm:text-3xl">
                  {fig}
                </dt>
                <dd className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  {label}
                </dd>
              </div>
            ))}
          </dl>

          <div className="animate-fade-rise-delay-2 mt-12 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
            <a
              href="#book"
              className="press-cta group inline-flex items-center gap-3 rounded-full bg-ink-base/95 py-2 pl-7 pr-2 text-base font-medium text-cream ring-1 ring-white/15 shadow-xl backdrop-blur-sm"
            >
              Book a free demo
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-ink-base">
                <span className="cta-arrow">&rarr;</span>
              </span>
            </a>
            <a
              href="#offer"
              className="press-cta group inline-flex items-center gap-3 rounded-full bg-ink-base/95 py-2 pl-7 pr-2 text-base font-medium text-cream ring-1 ring-white/15 shadow-xl backdrop-blur-sm"
            >
              How it works
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-ink-base">
                <span className="cta-arrow">&darr;</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
