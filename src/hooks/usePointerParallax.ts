import { useEffect, type RefObject } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../components/motion/MotionProvider'

export interface ParallaxTarget { sel: string; x?: number; y?: number; /** max tilt in degrees */ rot?: number }

/** Smoothed pointer response for selected children. Fine pointers only; no React state; resets on leave. */
export function usePointerParallax(root: RefObject<HTMLElement | null>, targets: ParallaxTarget[]) {
  const { reduced } = useMotion()
  useEffect(() => {
    const el = root.current
    if (!el || reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const set = targets.flatMap((t) => Array.from(el.querySelectorAll<HTMLElement>(t.sel)).map((node) => {
      if (t.rot) gsap.set(node, { transformPerspective: 900 })
      const o = { duration: 0.9, ease: 'power3' }
      return { t, x: gsap.quickTo(node, 'x', o), y: gsap.quickTo(node, 'y', o), rx: gsap.quickTo(node, 'rotationX', o), ry: gsap.quickTo(node, 'rotationY', o) }
    }))
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2, ny = ((e.clientY - r.top) / r.height - 0.5) * 2
      set.forEach((s) => { s.x(nx * (s.t.x ?? 0)); s.y(ny * (s.t.y ?? 0)); if (s.t.rot) { s.ry(nx * s.t.rot); s.rx(-ny * s.t.rot) } })
    }
    const leave = () => set.forEach((s) => { s.x(0); s.y(0); s.rx(0); s.ry(0) })
    el.addEventListener('pointermove', move, { passive: true })
    el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); leave() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])
}
