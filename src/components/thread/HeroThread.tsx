import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useMotion } from '../motion/MotionProvider'
import { smoothPath, type Pt } from '../../lib/curve'

/** Font metrics via canvas so cap-height / baseline are exact for the rendered face. */
function metrics(el: HTMLElement, probe = 'H') {
  const cs = getComputedStyle(el), fs = parseFloat(cs.fontSize)
  const ctx = document.createElement('canvas').getContext('2d')!
  ctx.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`
  const m = ctx.measureText(probe)
  return { fs, lh: parseFloat(cs.lineHeight) || fs * 0.86, fa: m.fontBoundingBoxAscent ?? fs * 0.95, fd: m.fontBoundingBoxDescent ?? fs * 0.25, asc: m.actualBoundingBoxAscent }
}

function measure(stage: HTMLElement) {
  const sr = stage.getBoundingClientRect()
  const masks = Array.from(stage.querySelectorAll<HTMLElement>('.hero-title .mask'))
  const dot = stage.querySelector<HTMLElement>('.hero-title .accent')
  if (masks.length < 3 || !dot) return null
  const g = masks.map((mask) => {
    const inner = mask.firstElementChild as HTMLElement
    const mr = mask.getBoundingClientRect() // parent of the animated line → not affected by the reveal transform
    const rg = document.createRange(); rg.selectNodeContents(inner)
    const tr = rg.getBoundingClientRect()
    const k = metrics(inner)
    const base = mr.top - sr.top + (k.lh - (k.fa + k.fd)) / 2 + k.fa
    const cap = metrics(inner, 'H').asc
    return { left: tr.left - sr.left, right: tr.right - sr.left, base, cap, fs: k.fs }
  })
  const dr = dot.getBoundingClientRect()
  const dk = metrics(dot.parentElement as HTMLElement, '.')
  return { w: sr.width, h: sr.height, g, dotX: dr.left - sr.left + dr.width / 2, dotY: g[2].base - dk.asc / 2 }
}

/**
 * The thread is part of the headline: it emerges from the left edge, runs BEHIND the letters of SYSTEMS (visible only
 * in the gaps), surfaces after the S, then crosses IN FRONT of the K of WORK and ends in a ring around the orange full stop.
 * Geometry is measured from the rendered text (px viewBox), rebuilt on resize / font load; progress is preserved.
 */
export function HeroThread({ ready }: { ready: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const st = useRef({ progress: 0, tl: null as gsap.core.Timeline | null, drive: null as gsap.core.Tween | null })
  const { reduced } = useMotion()

  useEffect(() => {
    const w = wrap.current, stage = w?.parentElement
    if (!w || !stage) return
    if (reduced) st.current.progress = 1
    const q = <T extends Element>(s: string) => w.querySelector<T>(s)!
    const [svgB, svgF] = [q<SVGSVGElement>('.ht-back'), q<SVGSVGElement>('.ht-front')]
    const pA = q<SVGPathElement>('.ht-a'), pB = q<SVGPathElement>('.ht-b')
    const n0 = q<SVGRectElement>('.ht-n0'), n1 = q<SVGCircleElement>('.ht-n1'), n2 = q<SVGCircleElement>('.ht-n2')

    const build = () => {
      const m = measure(stage); if (!m) return
      ;[svgB, svgF].forEach((s) => s.setAttribute('viewBox', `0 0 ${m.w} ${m.h}`))
      const l2 = m.g[1], fs = l2.fs
      const y2 = l2.base - l2.cap / 2
      const xEmerge = Math.min(l2.right + fs * 0.28, m.dotX - fs * 1.1)
      const a: Pt[] = [[0, y2], [xEmerge * 0.35, y2 - fs * 0.03], [xEmerge * 0.7, y2 + fs * 0.03], [xEmerge, y2]]
      const kx = m.dotX - fs * 0.32, ky = m.dotY - m.g[2].cap * 0.3
      const b: Pt[] = [[xEmerge, y2], [xEmerge + (kx - xEmerge) * 0.35, y2 + (ky - y2) * 0.42], [kx, ky], [m.dotX, m.dotY]]
      pA.setAttribute('d', smoothPath(a)); pB.setAttribute('d', smoothPath(b))
      n0.setAttribute('x', '-7'); n0.setAttribute('y', String(y2 - 7))
      n1.setAttribute('cx', String(xEmerge)); n1.setAttribute('cy', String(y2))
      n2.setAttribute('cx', String(m.dotX)); n2.setAttribute('cy', String(m.dotY)); n2.setAttribute('r', String(fs * 0.17))

      st.current.tl?.kill()
      gsap.set([pA, pB], { strokeDashoffset: 1 })
      gsap.set([n0, n1, n2], { scale: 0.3, opacity: 0, transformOrigin: '50% 50%' })
      const la = pA.getTotalLength(), lb = pB.getTotalLength(), tA = la / (la + lb)
      const tl = gsap.timeline({ paused: true })
      tl.to(n0, { scale: 1, opacity: 1, duration: 0.05, ease: 'power2.out' }, 0)
        .to(pA, { strokeDashoffset: 0, duration: tA, ease: 'none' }, 0.02)
        .to(n1, { scale: 1, opacity: 1, duration: 0.05, ease: 'power2.out' }, tA + 0.02)
        .to(pB, { strokeDashoffset: 0, duration: 1 - tA, ease: 'none' }, tA + 0.02)
        .to(n2, { scale: 1, opacity: 1, duration: 0.07, ease: 'power2.out' }, 1.0)
      tl.progress(st.current.progress)
      st.current.tl = tl
    }
    build()
    const ro = new ResizeObserver(build); ro.observe(stage)
    let alive = true
    document.fonts?.ready.then(() => { if (alive) build() })
    return () => { alive = false; ro.disconnect(); st.current.tl?.kill(); st.current.drive?.kill() }
  }, [reduced])

  useEffect(() => {
    if (!ready || reduced) return
    const proxy = { p: 0 }
    st.current.drive = gsap.to(proxy, { p: 1, duration: 2.4, delay: 0.7, ease: 'power1.inOut', onUpdate: () => { st.current.progress = proxy.p; st.current.tl?.progress(proxy.p) } })
    return () => { st.current.drive?.kill() }
  }, [ready, reduced])

  return (
    <div ref={wrap} className="hero-thread-wrap" aria-hidden="true">
      <svg className="ht ht-back" preserveAspectRatio="none" focusable="false"><path className="th-path ht-a" pathLength={1} /><rect className="th-node ht-n0" width="14" height="14" /></svg>
      <svg className="ht ht-front" preserveAspectRatio="none" focusable="false"><path className="th-path ht-b" pathLength={1} /><circle className="th-node ht-n1" r="7" /><circle className="th-ring ht-n2" /></svg>
    </div>
  )
}
