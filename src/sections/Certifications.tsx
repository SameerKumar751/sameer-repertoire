import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../components/motion/MotionProvider'
import { Section } from '../components/layout/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal } from '../components/motion/Reveal'
import { CertPreview } from '../features/certifications/CertPreview'
import { certifications } from '../data/certifications'
import type { Certification } from '../types/portfolio'

const STATUS: Record<Certification['status'], string> = { earned: 'Certificate earned', 'in-progress': 'In progress', pending: 'Verification pending' }
const W = 352, H = 264

export function Certifications() {
  const float = useRef<HTMLDivElement>(null)
  const layers = useRef<(HTMLDivElement | null)[]>([])
  const active = useRef(-1)
  const quick = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null)
  const [open, setOpen] = useState<string | null>(null) // tap / click / keyboard expansion (touch-friendly)
  const { reduced } = useMotion()
  const dur = reduced ? 0 : 0.4

  useEffect(() => {
    const f = float.current
    if (!f || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    gsap.set(f, { autoAlpha: 0, x: 0, y: 0 })
    gsap.set(layers.current, { autoAlpha: 0 })
    quick.current = { x: gsap.quickTo(f, 'x', { duration: reduced ? 0 : 0.6, ease: 'power3' }), y: gsap.quickTo(f, 'y', { duration: reduced ? 0 : 0.6, ease: 'power3' }) }
    return () => { gsap.killTweensOf([f, ...layers.current]); quick.current = null }
  }, [reduced])

  const place = (cx: number, cy: number) => {
    const x = Math.min(cx + 28, window.innerWidth - W - 16)
    const y = Math.max(16, Math.min(cy - H / 2, window.innerHeight - H - 16))
    quick.current?.x(x); quick.current?.y(y)
  }
  const show = (i: number) => {
    if (!quick.current || active.current === i) return
    active.current = i
    layers.current.forEach((l, j) => l && gsap.to(l, { autoAlpha: j === i ? 1 : 0, scale: j === i ? 1 : 0.97, duration: dur, ease: 'power2.out', overwrite: 'auto' }))
    gsap.to(float.current, { autoAlpha: 1, duration: dur, overwrite: 'auto' })
  }
  const hide = () => {
    if (!quick.current) return
    active.current = -1
    gsap.to(float.current, { autoAlpha: 0, duration: dur })
  }

  return (
    <Section id="certifications" theme="dark" className="certs">
      <SectionHeading id="certifications-title" title="Certifications" />
      <Reveal as="ul" variant="stagger" className="cert-list">
        {certifications.map((c, i) => {
          const expanded = open === c.id
          return (
            <li key={c.id} className="cert-item"
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') { show(i); place(e.clientX, e.clientY) } }}
                onPointerMove={(e) => { if (e.pointerType === 'mouse') place(e.clientX, e.clientY) }}
                onPointerLeave={(e) => { if (e.pointerType === 'mouse') hide() }}>
              <button type="button" className="cert-row" aria-expanded={expanded} aria-controls={`cp-${c.id}`}
                      onClick={() => setOpen(expanded ? null : c.id)}
                      onFocus={(e) => { if (e.currentTarget.matches(':focus-visible')) { const r = e.currentTarget.getBoundingClientRect(); show(i); place(r.right - W - 24, r.top + r.height / 2) } }}
                      onBlur={hide}>
                <span className="t-mono mute">0{i + 1}</span>
                <span className="cert-name t-h3">{c.name}</span>
                <span className="cert-meta t-mono">
                  {[c.issuer, STATUS[c.status], c.date].filter(Boolean).join(' · ')}
                </span>
                <span className="cert-plus" aria-hidden="true">{expanded ? '−' : '+'}</span>
              </button>
              {expanded && (
                <div id={`cp-${c.id}`} className="cert-inline">
                  <CertPreview cert={c} />
                  {c.url && <a className="t-mono" href={c.url} target="_blank" rel="noopener noreferrer">View credential ↗</a>}
                </div>
              )}
            </li>
          )
        })}
      </Reveal>
      <div ref={float} className="cert-float" aria-hidden="true">
        {certifications.map((c, i) => (
          <div key={c.id} ref={(el) => { layers.current[i] = el }} className="cert-layer"><CertPreview cert={c} /></div>
        ))}
      </div>
    </Section>
  )
}
