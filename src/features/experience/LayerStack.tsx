import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useMotion } from '../../components/motion/MotionProvider'
import { usePointerParallax, type ParallaxTarget } from '../../hooks/usePointerParallax'

const LAYERS = [
  { y: 30, label: 'FRONTEND', sub: 'React · Vite' },
  { y: 130, label: 'API', sub: 'Node · Express', hot: true },
  { y: 230, label: 'DATA', sub: 'MongoDB' },
  { y: 330, label: 'RUNTIME', sub: 'Docker' },
]
const TILT: ParallaxTarget[] = [{ sel: '.ls-svg', rot: 7, x: 6, y: 4 }]

/** Conceptual layers of the KIF-RMS stack (frontend → API → data → runtime), drawn on scroll, tilting subtly with the pointer. */
export function LayerStack() {
  const root = useRef<HTMLDivElement>(null)
  const { reduced } = useMotion()
  usePointerParallax(root, TILT)

  useGSAP(() => {
    if (reduced) return
    const paths = gsap.utils.toArray<SVGPathElement>('.ls-layer', root.current)
    const spine = root.current!.querySelector('.ls-spine')
    const nodes = gsap.utils.toArray<SVGElement>('.ls-node', root.current)
    const labels = gsap.utils.toArray<SVGElement>('.ls-label', root.current)
    gsap.set([...paths, spine], { strokeDashoffset: 1 }); gsap.set(nodes, { scale: 0.3, opacity: 0 }); gsap.set(labels, { opacity: 0 })
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'bottom 45%', scrub: 0.7 } })
    tl.to(spine, { strokeDashoffset: 0, duration: 1 }, 0)
    paths.forEach((p, i) => {
      tl.to(p, { strokeDashoffset: 0, duration: 0.3 }, i * 0.22)
      tl.to(nodes[i], { scale: 1, opacity: 1, duration: 0.08, ease: 'power2.out' }, i * 0.22 + 0.2)
      tl.to(labels[i], { opacity: 1, duration: 0.12 }, i * 0.22 + 0.22)
    })
  }, { scope: root, dependencies: [reduced] })

  return (
    <div ref={root} className="ls">
      <svg className="ls-svg" viewBox="0 0 440 460" role="img" aria-label="Conceptual diagram of the application layers: frontend, API, data and runtime">
        <path className="ls-spine th-path" d="M170 78 V378" pathLength={1} />
        {LAYERS.map((l) => (
          <g key={l.label}>
            <path className={`ls-layer th-path ${l.hot ? 'is-hot' : ''}`} d={`M170 ${l.y} L320 ${l.y + 48} L170 ${l.y + 96} L20 ${l.y + 48} Z`} pathLength={1} />
            <circle className="ls-node" cx="170" cy={l.y + 48} r="6" />
            <g className="ls-label"><text x="338" y={l.y + 46} className="ls-t">{l.label}</text><text x="338" y={l.y + 60} className="ls-s">{l.sub}</text></g>
          </g>
        ))}
      </svg>
      <p className="t-mono mute ls-cap">Conceptual layers</p>
    </div>
  )
}
