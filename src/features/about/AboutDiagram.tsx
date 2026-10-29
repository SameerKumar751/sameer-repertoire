import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useMotion } from '../../components/motion/MotionProvider'

const L = [{ y: 10, t: 'FRONTEND' }, { y: 58, t: 'BACKEND', hot: true }, { y: 106, t: 'DATA' }]

/** Three layers — the stack the About copy describes (frontend, backend, data) — drawn on scroll after the rail. */
export function AboutDiagram() {
  const root = useRef<SVGSVGElement>(null)
  const { reduced } = useMotion()
  useGSAP(() => {
    const svg = root.current
    if (!svg || reduced) return
    const ls = gsap.utils.toArray<SVGPathElement>('.ad-layer', svg), spine = svg.querySelector('.ad-spine')
    const dots = gsap.utils.toArray<SVGElement>('.ad-node', svg), tx = gsap.utils.toArray<SVGElement>('.ad-t', svg)
    gsap.set([...ls, spine], { strokeDashoffset: 1 }); gsap.set(dots, { scale: 0.3, opacity: 0, transformOrigin: '50% 50%' }); gsap.set(tx, { opacity: 0 })
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: svg, start: 'top 85%', end: 'top 40%', scrub: 0.3 } })
    tl.to(spine, { strokeDashoffset: 0, duration: 1 }, 0)
    ls.forEach((p, i) => {
      tl.to(p, { strokeDashoffset: 0, duration: 0.4 }, i * 0.3)
      tl.to(dots[i], { scale: 1, opacity: 1, duration: 0.1, ease: 'power2.out' }, i * 0.3 + 0.3)
      tl.to(tx[i], { opacity: 1, duration: 0.15 }, i * 0.3 + 0.3)
    })
  }, { scope: root, dependencies: [reduced] })
  return (
    <svg ref={root} className="about-diagram" viewBox="0 0 260 170" role="img" aria-label="Diagram of three layers: frontend, backend and data">
      <path className="ad-spine th-path" d="M80 34 V130" pathLength={1} />
      {L.map((l) => (
        <g key={l.t}>
          <path className={`ad-layer th-path ${l.hot ? 'is-hot' : ''}`} d={`M80 ${l.y} L140 ${l.y + 24} L80 ${l.y + 48} L20 ${l.y + 24} Z`} pathLength={1} />
          <circle className="ad-node" cx="80" cy={l.y + 24} r="4.5" />
          <text className="ad-t" x="156" y={l.y + 28}>{l.t}</text>
        </g>
      ))}
    </svg>
  )
}
