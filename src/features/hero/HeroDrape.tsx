import { useEffect, useRef } from 'react'
import { useMotion } from '../../components/motion/MotionProvider'
import { useRenderGate } from '../../hooks/useRenderGate'

/**
 * Atmospheric "drape": a perspective grid of dots displaced by slow folds (ivory, orange on crests).
 * Canvas 2D (no WebGL needed → no WebGL failure mode). Low alpha so the headline stays dominant.
 * Stand-in built in-house; replace with React Bits "Spectral Drape" once the licensed component is installed.
 */
export function HeroDrape({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { reduced } = useMotion()
  const gate = useRenderGate('about')

  useEffect(() => {
    const c = ref.current, ctx = c?.getContext('2d')
    if (!c || !ctx) return
    const small = window.matchMedia('(max-width: 699px)').matches
    const cols = small ? 34 : 70, rows = small ? 20 : 36
    let w = 0, h = 0, raf = 0, last = 0, fade = reduced ? 1 : 0
    const resize = () => {
      const r = c.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = r.width; h = r.height; c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(last)
    }
    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h)
      for (let j = 0; j < rows; j++) {
        const z = j / (rows - 1), persp = 1 / (1 + z * 1.7)
        const yBase = h * (1.02 - Math.pow(z, 0.72) * 0.72)
        for (let i = 0; i < cols; i++) {
          const x = (i / (cols - 1)) * 2 - 1
          const fold = Math.sin(x * 3.1 + time * 0.3 + z * 2.4) * 0.5 + Math.sin(x * 6.3 - time * 0.2 + z * 4.1) * 0.17
          const sx = w * 0.5 + x * w * 0.95 * persp
          const sy = yBase - fold * h * 0.13 * persp
          const edge = 1 - Math.min(1, Math.abs(x) ** 3)
          const a = (0.1 + 0.42 * persp) * edge * fade
          if (a < 0.02) continue
          const crest = fold > 0.46
          ctx.fillStyle = crest ? `rgba(240,75,50,${Math.min(0.9, a * 1.5)})` : `rgba(243,240,232,${a})`
          const s = 0.6 + 1.9 * persp
          ctx.fillRect(sx - s / 2, sy - s / 2, s, s)
        }
      }
    }
    const ro = new ResizeObserver(resize)
    ro.observe(c)
    resize()
    if (!reduced) {
      const tick = (ms: number) => {
        raf = requestAnimationFrame(tick)
        if (!gate.current || ms - last < 33) return // ~30fps, paused when hidden/covered
        last = ms; fade = Math.min(1, fade + 0.015)
        draw(ms / 1000)
      }
      raf = requestAnimationFrame(tick)
    }
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [reduced, gate])

  return <canvas ref={ref} className={`hero-drape ${active ? 'on' : ''}`} aria-hidden="true" />
}
