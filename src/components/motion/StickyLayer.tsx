import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { useMotion } from './MotionProvider'

/**
 * A layer that stays stationary while the NEXT sibling (z-index 1) scrolls up over it.
 * Uses position: sticky (no transforms on ancestors, no pin-spacers). `top` is set to
 * min(0, viewport - height) so a layer taller than the viewport scrolls fully into view first,
 * then holds with its bottom edge at the viewport bottom.
 * `coveredBy` (element id) dims the layer, scrubbed by real scroll position, as that element covers it.
 */
export function StickyLayer({ children, coveredBy, className = '' }: { children: ReactNode; coveredBy?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced } = useMotion()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    let call: gsap.core.Tween | null = null
    const update = () => {
      el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`
      call?.kill()
      call = gsap.delayedCall(0.15, () => ScrollTrigger.refresh())
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => { ro.disconnect(); window.removeEventListener('resize', update); call?.kill() }
  }, [])

  useGSAP(() => {
    const cover = coveredBy ? document.getElementById(coveredBy) : null
    if (!ref.current || !cover || reduced) return
    gsap.to(ref.current, { opacity: 0.3, ease: 'none', scrollTrigger: { trigger: cover, start: 'top bottom', end: 'top 15%', scrub: true } })
  }, { dependencies: [reduced, coveredBy] })

  return <div ref={ref} className={`sticky-layer ${className}`}>{children}</div>
}
