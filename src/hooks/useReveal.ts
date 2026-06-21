import { useEffect, useRef, useState } from 'react'

/**
 * Fires once when the element scrolls into view. Used to trigger band wipes
 * and paper-section reveals. Honors the IntersectionObserver "fire once"
 * contract by disconnecting after the first intersection.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  rootMargin = '0px 0px -10% 0px',
) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || shown) return
    // SSR / no-observer safety: just show.
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    // If the element is already within (or above) the viewport on mount,
    // reveal immediately - never leave on-screen content hidden.
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < vh && rect.bottom > 0) {
      setShown(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            obs.disconnect()
            break
          }
        }
      },
      // threshold 0 = fire on the first pixel that enters; far more reliable
      // for tall full-bleed bands than a 15% threshold.
      { rootMargin, threshold: 0 },
    )
    obs.observe(el)
    // Safety net: if the observer never fires (layout shifts, edge cases),
    // force the content visible rather than stranding it at opacity:0.
    const fallback = window.setTimeout(() => setShown(true), 1500)
    return () => {
      obs.disconnect()
      window.clearTimeout(fallback)
    }
  }, [rootMargin, shown])

  return { ref, shown }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
