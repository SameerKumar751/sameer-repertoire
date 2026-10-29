import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useMotion } from '../motion/MotionProvider'

/**
 * Desktop-only (hover + fine pointer). gsap.quickTo smooths movement; no React state per pointer move.
 * States: default · interactive (scaled) · labelled [data-cursor="VIEW"] · large [data-cursor-size="big"].
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const { reduced } = useMotion()

  useEffect(() => {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const d = dot.current, r = ring.current
    if (!d || !r) return
    const dx = gsap.quickTo(d, 'x', { duration: 0.1 }), dy = gsap.quickTo(d, 'y', { duration: 0.1 })
    const rx = gsap.quickTo(r, 'x', { duration: 0.5, ease: 'power3' }), ry = gsap.quickTo(r, 'y', { duration: 0.5, ease: 'power3' })
    const html = document.documentElement

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      html.classList.add('has-cursor')
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest<HTMLElement>('a, button, [data-cursor], [data-cursor-size]')
      const label = t?.dataset.cursor
      r.classList.toggle('is-link', !!label)
      r.classList.toggle('is-big', t?.dataset.cursorSize === 'big')
      r.textContent = label ?? ''
      gsap.to(r, { scale: t && !label && !t.dataset.cursorSize ? 1.6 : 1, duration: 0.3, ease: 'power3.out', overwrite: 'auto' })
    }
    const leave = () => html.classList.remove('has-cursor')
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    html.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      html.removeEventListener('pointerleave', leave)
      html.classList.remove('has-cursor')
    }
  }, [reduced])

  return (<><div ref={ring} className="cursor-ring" aria-hidden="true" /><div ref={dot} className="cursor-dot" aria-hidden="true" /></>)
}
