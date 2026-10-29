import { useEffect, useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useMotion } from '../motion/MotionProvider'
import { SIGNATURE } from '../../config/signature'
import { HandIllustration } from './HandIllustration'

const KEY = 'sk-loader-seen'
const SAFETY_MS = 6000
const PAUSE = 0.3   // initial pause (s)
const DRAW = 1.3    // total drawing time (s), split across strokes by path length

export function SignatureLoader({ onExit }: { onExit: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const done = useRef(false)
  const { reduced } = useMotion()

  const finish = () => {
    if (done.current) return
    done.current = true
    document.documentElement.style.overflow = ''
    try { sessionStorage.setItem(KEY, '1') } catch { /* storage unavailable */ }
    onExit()
  }

  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem(KEY) === '1' } catch { /* ignore */ }
    if (seen) { finish(); return }
    document.documentElement.style.overflow = 'hidden'
    const safety = window.setTimeout(finish, SAFETY_MS) // never stuck
    return () => { window.clearTimeout(safety); document.documentElement.style.overflow = '' }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useGSAP(() => {
    const el = root.current
    if (!el || done.current) return
    const paths = gsap.utils.toArray<SVGPathElement>('.sig', el)
    const hand = el.querySelector('.hand')
    const lens = paths.map((p) => p.getTotalLength())
    paths.forEach((p, i) => gsap.set(p, { strokeDasharray: lens[i], strokeDashoffset: lens[i] }))

    if (reduced) {
      gsap.set(paths, { strokeDashoffset: 0 })
      gsap.set(hand, { autoAlpha: 0 })
      gsap.timeline({ onComplete: finish }).to(el, { autoAlpha: 0, duration: 0.3, delay: 0.5 })
      return
    }

    const total = lens.reduce((a, b) => a + b, 0)
    const tl = gsap.timeline({ delay: PAUSE })
    gsap.set(hand, { autoAlpha: 0 })
    paths.forEach((p, i) => {
      const start = p.getPointAtLength(0)
      const proxy = { l: 0 }
      // lift & move the hand to the next stroke's start, then draw
      tl.set(hand, { x: start.x, y: start.y, autoAlpha: 1 })
      tl.to(proxy, {
        l: lens[i],
        duration: DRAW * (lens[i] / total),
        ease: 'power1.inOut',
        onUpdate: () => {
          p.style.strokeDashoffset = String(lens[i] - proxy.l)
          const pt = p.getPointAtLength(proxy.l)
          gsap.set(hand, { x: pt.x, y: pt.y })
        },
      })
      if (i < paths.length - 1) tl.to({}, { duration: 0.05 })
    })
    tl.to(hand, { autoAlpha: 0, y: '-=10', duration: 0.2 })
      .to({}, { duration: 0.2 }) // brief completion state
      .add(finish)
      .to(el, { yPercent: -100, duration: 0.55, ease: 'power4.inOut' }, '<')
  }, { scope: root, dependencies: [reduced] })

  return (
    <div ref={root} className="loader" role="status" aria-label="Loading Sameer Kumar portfolio">
      <svg viewBox={SIGNATURE.viewBox} aria-hidden="true" focusable="false">
        {SIGNATURE.strokes.map((d, i) => (
          <path key={i} className={`sig ${(SIGNATURE.accentStrokes as readonly number[]).includes(i) ? 'sig-accent' : ''}`} d={d} />
        ))}
        <HandIllustration />
      </svg>
    </div>
  )
}
