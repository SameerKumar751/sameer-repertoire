import { useEffect, useRef } from 'react'
import { useMotion } from '../../components/motion/MotionProvider'
import { useRenderGate } from '../../hooks/useRenderGate'

interface P { hx: number; hy: number; x: number; y: number; vx: number; vy: number; o: boolean }

/**
 * Particle wordmark: dots forming the text scatter away from the pointer and spring back.
 * Reads the pointer from window (canvas has pointer-events: none), so it never blocks the page.
 * Touch: a tap scatters briefly. Reduced motion: static. Idles (no work) when settled.
 * Stand-in built in-house; replace with React Bits "Particle Text" once the licensed component is installed.
 */
export function ParticleName({ text = 'SAMEER' }: { text?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const { reduced } = useMotion()
  const gate = useRenderGate('about')

  useEffect(() => {
    const el = wrap.current, c = cv.current, ctx = c?.getContext('2d')
    if (!el || !c || !ctx) return
    let raf = 0, ps: P[] = [], w = 0, h = 0, alive = true
    const ptr = { x: -9999, y: -9999, on: false }
    let clearT = 0, awake = false

    const build = () => {
      const r = el.getBoundingClientRect(); w = r.width; h = r.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const off = document.createElement('canvas'); off.width = Math.round(w); off.height = Math.round(h)
      const o = off.getContext('2d', { willReadFrequently: true })!
      const family = '"Bricolage Grotesque Variable", "Bricolage Grotesque", Arial, sans-serif'
      let fs = h * 0.92
      o.font = `800 ${fs}px ${family}`
      const m = o.measureText(text).width
      if (m > w * 0.98) { fs *= (w * 0.98) / m; o.font = `800 ${fs}px ${family}` }
      o.textBaseline = 'middle'; o.textAlign = 'center'; o.fillStyle = '#fff'
      o.fillText(text, w / 2, h / 2)
      const data = o.getImageData(0, 0, off.width, off.height).data
      const step = w < 300 ? 3 : 4
      ps = []
      for (let y = 0; y < off.height; y += step) for (let x = 0; x < off.width; x += step) {
        if (data[(y * off.width + x) * 4 + 3] > 128) ps.push({ hx: x, hy: y, x, y, vx: 0, vy: 0, o: ps.length % 9 === 0 })
      }
      paint()
    }
    const paint = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of ps) { ctx.fillStyle = p.o ? 'rgb(240,75,50)' : 'rgba(243,240,232,.85)'; ctx.fillRect(p.x, p.y, 2, 2) }
    }
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!alive || !gate.current || !awake) return
      const R = 90; let energy = 0
      for (const p of ps) {
        if (ptr.on) {
          const dx = p.x - ptr.x, dy = p.y - ptr.y, d = Math.hypot(dx, dy)
          if (d < R && d > 0.01) { const f = (1 - d / R) ** 2 * 5; p.vx += (dx / d) * f; p.vy += (dy / d) * f }
        }
        p.vx += (p.hx - p.x) * 0.06; p.vy += (p.hy - p.y) * 0.06
        p.vx *= 0.86; p.vy *= 0.86
        p.x += p.vx; p.y += p.vy
        energy += Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(p.hx - p.x) + Math.abs(p.hy - p.y)
      }
      paint()
      if (!ptr.on && energy < 0.5) { awake = false; for (const p of ps) { p.x = p.hx; p.y = p.hy } paint() }
    }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top
      const near = ptr.x > -100 && ptr.x < r.width + 100 && ptr.y > -100 && ptr.y < r.height + 100
      ptr.on = near; if (near) awake = true
      if (e.pointerType !== 'mouse') { window.clearTimeout(clearT); clearT = window.setTimeout(() => { ptr.on = false }, 500) } // tap: brief scatter
    }
    const out = () => { ptr.on = false }

    const start = () => {
      if (!alive) return
      build()
      if (reduced) return
      window.addEventListener('pointermove', move, { passive: true })
      window.addEventListener('pointerdown', move, { passive: true })
      document.documentElement.addEventListener('pointerleave', out)
      raf = requestAnimationFrame(tick)
    }
    // wait for the display font so the sampled shape is right (never block: 1.5s cap)
    const cap = window.setTimeout(start, 1500)
    let started = false
    const go = () => { if (started) return; started = true; window.clearTimeout(cap); start() }
    document.fonts?.load('800 100px "Bricolage Grotesque Variable"').then(go, go)
    const ro = new ResizeObserver(() => { if (started) build() })
    ro.observe(el)
    return () => {
      alive = false; started = true; window.clearTimeout(cap); window.clearTimeout(clearT); cancelAnimationFrame(raf); ro.disconnect()
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', move)
      document.documentElement.removeEventListener('pointerleave', out)
    }
  }, [reduced, text, gate])

  return <div ref={wrap} className="hero-particles" data-hero="fade" aria-hidden="true"><canvas ref={cv} /></div>
}
