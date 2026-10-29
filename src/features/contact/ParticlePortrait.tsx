import { useEffect, useRef, useState } from 'react'
import { useMotion } from '../../components/motion/MotionProvider'
import { ASSETS } from '../../config/assets'

/** Crop of the source photo (px) and where the face sits inside it — tune these if you replace the image. */
const CROP = { x: 165, y: 335, w: 480, h: 600 }
const FACE = { fx: (405 - 165) / 480, fy: (570 - 335) / 600, rxL: 0.4, rxR: 0.3, ry: 0.44 } // narrower on the right: cuts the door frame
interface Cell { u: number; v: number; dark: number; orange: boolean }
interface P { u: number; v: number; s: number; x: number; y: number; vx: number; vy: number; hx: number; hy: number; orange: boolean }

/**
 * Image-based particle portrait: the photo is sampled on a grid; each cell becomes a square whose size follows the
 * tone (darker → larger), so the face reads like a halftone. The pointer pushes nearby particles away (spring back),
 * same pointer-gated, idle-when-settled loop as the hero's ParticleName. Canvas 2D, pointer-events none (reads the
 * pointer from window), fine pointers only, static under reduced motion, <img> fallback if canvas is unavailable.
 */
export function ParticlePortrait() {
  const wrap = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const [fallback, setFallback] = useState(false)
  const { reduced } = useMotion()

  useEffect(() => {
    const el = wrap.current, c = cv.current, ctx = c?.getContext('2d')
    if (!el || !c || !ctx) { setFallback(true); return }
    let alive = true, raf = 0, w = 0, h = 0, cell = 1, visible = false, awake = false
    let cells: Cell[] = [], ps: P[] = []
    const ptr = { x: -9999, y: -9999, on: false }
    const small = window.matchMedia('(max-width: 699px)').matches
    const cols = small ? 56 : 80, rows = Math.round(cols * 1.25)
    const interactive = !reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches

    const layout = () => {
      const r = el.getBoundingClientRect(); w = r.width; h = r.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cell = w / cols
      ps = cells.map((k) => { const hx = k.u * w, hy = k.v * h; return { u: k.u, v: k.v, s: Math.max(1.2, cell * k.dark * 0.95), x: hx, y: hy, vx: 0, vy: 0, hx, hy, orange: k.orange } })
      paint()
    }
    const paint = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of ps) { ctx.fillStyle = p.orange ? '#F04B32' : '#050505'; ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s) }
    }
    const sample = (img: HTMLImageElement) => {
      const off = document.createElement('canvas'); off.width = cols; off.height = rows
      const o = off.getContext('2d', { willReadFrequently: true })!
      o.drawImage(img, CROP.x, CROP.y, CROP.w, CROP.h, 0, 0, cols, rows)
      const d = o.getImageData(0, 0, cols, rows).data
      const lum = new Float32Array(cols * rows)
      for (let i = 0; i < lum.length; i++) lum[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255
      const sorted = Array.from(lum).sort((a, b) => a - b)
      const lo = sorted[Math.floor(sorted.length * 0.01)], hi = sorted[Math.floor(sorted.length * 0.99)] || 1 // auto-contrast
      cells = []
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const l = Math.min(1, Math.max(0, (lum[y * cols + x] - lo) / Math.max(0.01, hi - lo)))
        const nx = (x / cols - FACE.fx) / (x / cols > FACE.fx ? FACE.rxR : FACE.rxL), ny = (y / rows - FACE.fy) / FACE.ry
        const mask = Math.min(1, Math.max(0, 1.5 - Math.hypot(nx, ny) * 1.25)) // soft vignette removes the busy background
        const dark = Math.min(1, Math.max(0, 0.12 + (0.5 - l) * 2.6)) * mask
        if (dark > 0.1) cells.push({ u: (x + 0.5) / cols, v: (y + 0.5) / rows, dark, orange: dark > 0.7 && (x * 7 + y * 13) % 19 === 0 })
      }
      layout()
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!alive || !awake || !visible || document.hidden) return
      const R = w * 0.15; let energy = 0
      for (const p of ps) {
        if (ptr.on) {
          const dx = p.x - ptr.x, dy = p.y - ptr.y, dd = Math.hypot(dx, dy)
          if (dd < R && dd > 0.01) { const f = (1 - dd / R) ** 2 * cell * 0.9; p.vx += (dx / dd) * f; p.vy += (dy / dd) * f }
        }
        p.vx += (p.hx - p.x) * 0.075; p.vy += (p.hy - p.y) * 0.075
        p.vx *= 0.82; p.vy *= 0.82; p.x += p.vx; p.y += p.vy
        energy += Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(p.hx - p.x) + Math.abs(p.hy - p.y)
      }
      paint()
      if (!ptr.on && energy < 0.5) { awake = false; for (const p of ps) { p.x = p.hx; p.y = p.hy } paint() }
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top
      ptr.on = ptr.x > -80 && ptr.x < r.width + 80 && ptr.y > -80 && ptr.y < r.height + 80
      if (ptr.on) awake = true
    }
    const out = () => { ptr.on = false }

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(el)
    const ro = new ResizeObserver(() => { if (cells.length) layout() })
    ro.observe(el)
    const img = new Image()
    img.onload = () => { if (alive) { sample(img); if (interactive) { window.addEventListener('pointermove', move, { passive: true }); document.documentElement.addEventListener('pointerleave', out); raf = requestAnimationFrame(tick) } } }
    img.onerror = () => { if (alive) setFallback(true) }
    img.src = ASSETS.portrait
    return () => {
      alive = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect()
      window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', out)
    }
  }, [reduced])

  return (
    <div ref={wrap} className="contact-portrait">
      {!fallback && <canvas ref={cv} role="img" aria-label="Portrait of Sameer Kumar rendered as a field of dots" />}
      {fallback && <img className="portrait-static" src={ASSETS.portrait} alt="Portrait of Sameer Kumar" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />}
    </div>
  )
}
