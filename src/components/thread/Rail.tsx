import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useMotion } from '../motion/MotionProvider'

interface Props {
  className?: string
  start?: string
  end?: string
  /** adds a node riding the line tip */
  head?: boolean
  /** rail lives inside a StickyLayer: finish drawing exactly when the layer sticks, not at an unreachable scroll position */
  stuck?: boolean
}

/**
 * Vertical thread segment filling its positioned parent. ONE ScrollTrigger-driven timeline draws the line and reveals
 * every `.rail-node` in the parent at the moment the line reaches that node's real y-position, so nodes and path agree.
 * Rebuilt (not duplicated) when the parent resizes.
 */
export function Rail({ className = '', start = 'top 75%', end = 'bottom 55%', head, stuck }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const { reduced } = useMotion()

  useEffect(() => {
    const el = root.current
    if (!el || reduced) return
    const parent = el.parentElement!
    let ctx: gsap.Context | null = null

    const endFn = () => {
      if (!stuck) return end
      const sec = el.closest('section')!
      const gap = sec.getBoundingClientRect().bottom - el.getBoundingClientRect().bottom // invariant to sticky offset
      return `bottom ${Math.max(80, Math.round(window.innerHeight - gap))}px`
    }

    const build = () => {
      ctx?.revert()
      ctx = gsap.context(() => {
        const path = el.querySelector('.th-path')
        const h = el.querySelector('.rail-head')
        const nodes = gsap.utils.toArray<SVGElement>('.rail-node', parent)
        const rr = el.getBoundingClientRect()
        gsap.set(path, { strokeDashoffset: 1 })
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: el, start, end: endFn, scrub: 0.3, invalidateOnRefresh: true } })
        tl.to(path, { strokeDashoffset: 0, duration: 1 }, 0)
        nodes.forEach((n) => {
          const r = n.getBoundingClientRect()
          const f = Math.min(1, Math.max(0, (r.top + r.height / 2 - rr.top) / rr.height))
          gsap.set(n, { scale: 0.3, opacity: 0, transformOrigin: '50% 50%' })
          tl.to(n, { scale: 1, opacity: 1, duration: 0.04, ease: 'power2.out' }, Math.max(0, f - 0.01))
        })
        if (h) {
          gsap.set(h, { opacity: 0, transformOrigin: '50% 50%' })
          tl.fromTo(h, { y: 0 }, { y: () => el.clientHeight, duration: 1 }, 0).to(h, { opacity: 1, duration: 0.02 }, 0)
        }
      })
    }
    build()
    let first = true
    const ro = new ResizeObserver(() => { if (first) { first = false; return } build() })
    ro.observe(parent)
    return () => { ro.disconnect(); ctx?.revert() }
  }, [reduced, start, end, stuck])

  return (
    <div ref={root} className={`rail ${className}`} aria-hidden="true">
      <svg viewBox="0 0 24 100" preserveAspectRatio="none" focusable="false"><path className="th-path" d="M12 0 V100" pathLength={1} /></svg>
      {head && <svg className="rail-head" viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="7" /></svg>}
    </div>
  )
}

/** Static node marker used on rails (revealed by the rail timeline). */
export function Node({ className = '', filled }: { className?: string; filled?: boolean }) {
  return <svg className={`rail-node ${filled ? 'is-filled' : ''} ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="7" /></svg>
}
