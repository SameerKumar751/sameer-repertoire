import { useEffect, type RefObject } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useMotion } from '../components/motion/MotionProvider'

/**
 * One consistent interaction for large titles: damped 3D tilt toward the pointer (≤ 4°, ≤ 6px), eased back on leave.
 * Applied to the title element itself (outside its overflow mask). Touch: a gentle scroll-linked tilt instead of hover.
 */
export function useTitleTilt(root: RefObject<HTMLElement | null>, selector: string) {
  const { reduced } = useMotion()
  useEffect(() => {
    const el = root.current
    if (!el || reduced) return
    const titles: HTMLElement[] = Array.from((el as HTMLElement).querySelectorAll<HTMLElement>(selector))
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const cleanups: Array<() => void> = []
    titles.forEach((t) => {
      gsap.set(t, { transformPerspective: 800, transformOrigin: '50% 50%' })
      if (fine) {
        const o = { duration: 0.7, ease: 'power3' }
        const rx = gsap.quickTo(t, 'rotationX', o), ry = gsap.quickTo(t, 'rotationY', o), x = gsap.quickTo(t, 'x', o)
        const move = (e: PointerEvent) => {
          const r = t.getBoundingClientRect()
          const nx = ((e.clientX - r.left) / r.width - 0.5) * 2, ny = ((e.clientY - r.top) / r.height - 0.5) * 2
          ry(nx * 4); rx(-ny * 3); x(nx * 6)
        }
        const leave = () => { rx(0); ry(0); x(0) }
        t.addEventListener('pointermove', move, { passive: true }); t.addEventListener('pointerleave', leave)
        cleanups.push(() => { t.removeEventListener('pointermove', move); t.removeEventListener('pointerleave', leave); leave() })
      } else {
        const tw = gsap.fromTo(t, { rotationX: 5 }, { rotationX: -5, ease: 'none', scrollTrigger: { trigger: t, start: 'top bottom', end: 'bottom top', scrub: 0.5 } })
        cleanups.push(() => { tw.scrollTrigger?.kill(); tw.kill() })
      }
    })
    ScrollTrigger.refresh()
    return () => cleanups.forEach((c) => c())
  }, [reduced, selector, root])
}
