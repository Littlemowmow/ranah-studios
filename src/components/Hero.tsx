import { useEffect, useRef, useState } from 'react'
import Navbar from './Navbar'
import { prefersReducedMotion } from '../hooks/useReveal'
import heroVideo from '../assets/hero.mp4'
import heroPoster from '../assets/hero-poster.jpg'

// Self-hosted, web-optimized loop (1280w, ~0.5MB). The original CDN file was
// 13.5MB and blocked first paint; this streams behind a poster so the hero
// paints instantly and the video fades in once it can play.
const VIDEO_SRC = heroVideo

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  // When autoplay is blocked (iOS Low Power Mode, data saver), the browser draws a
  // play-button overlay on the <video>. Drop the video in that case and let the
  // static poster show, so there's no dead "play" control sitting over the hero.
  const [videoHidden, setVideoHidden] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reveal = () => {
      video.style.opacity = '1'
    }
    const blocked = () => setVideoHidden(true)

    if (prefersReducedMotion()) {
      video.play().then(reveal).catch(blocked)
      return
    }

    video.style.transition = 'opacity 0.6s ease-out'
    video.addEventListener('canplay', reveal, { once: true })
    const t = window.setTimeout(reveal, 500)
    video.play().then(reveal).catch(blocked)

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
      {/* Static poster base, also the fallback when autoplay is blocked (no play overlay) */}
      <img
        src={heroPoster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      {/* Background video fades in over the poster; dropped entirely if autoplay is blocked */}
      {!videoHidden && (
        <video
          ref={videoRef}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          style={{ opacity: 0 }}
          src={VIDEO_SRC}
          preload="auto"
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      {/* Subtle bottom vignette for headline legibility, no blobs/radials */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-navy/35 via-navy/25 to-navy/90" />

      {/* Foreground */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <div className="flex flex-1 flex-col items-center justify-end px-6 pb-24 pt-24 text-center">
          <p className="hero-legible animate-fade-rise mb-8 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-gold-soft">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
            Ranah &middot; Studios
          </p>

          <h1
            className="hero-legible animate-fade-rise max-w-7xl font-display font-normal leading-[0.95] tracking-[-2.46px] text-cream text-5xl sm:text-7xl md:text-8xl"
          >
            <strong className="font-semibold text-cream">Creative</strong> built to convert.{' '}
            <em className="not-italic text-cream/70">
              <strong className="font-semibold text-cream">Automation</strong> built to scale.
            </em>
          </h1>

          <p className="hero-legible animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-cream/85 sm:text-lg">
            A creative studio for independent{' '}
            <strong className="font-semibold text-cream">local businesses</strong>. We design sites
            that actually <strong className="font-semibold text-cream">rank in Google</strong>, build
            a <strong className="font-semibold text-cream">24/7 AI receptionist</strong> that books
            the call instead of dropping it to voicemail, and automate the busywork in between.
          </p>

          {/* Thin row of gold-numeral trust stats, agency credibility */}
          <dl className="hero-legible animate-fade-rise-delay mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-10">
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
                <dd className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/75">
                  {label}
                </dd>
              </div>
            ))}
          </dl>

          <div className="animate-fade-rise-delay-2 mt-12 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
            <a
              href="#book"
              className="btn-bubble press-cta group inline-flex items-center gap-3 rounded-full py-2 pl-7 pr-2 text-base font-medium text-cream"
            >
              Book a free demo
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-ink-base">
                <span className="cta-arrow">&rarr;</span>
              </span>
            </a>
            <a
              href="#offer"
              className="btn-bubble press-cta group inline-flex items-center gap-3 rounded-full py-2 pl-7 pr-2 text-base font-medium text-cream"
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
