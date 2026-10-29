import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { useMotion } from '../components/motion/MotionProvider'
import { Section } from '../components/layout/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Rail, Node } from '../components/thread/Rail'
import { PrincipleVisual } from '../features/principles/PrincipleVisual'
import { PrinciplesBackdrop } from '../features/principles/PrinciplesBackdrop'
import { profile } from '../data/profile'

const TAGS = ['real_use', 'clarity', 'system', 'iterate']

export function Principles() {
  const list = useRef<HTMLOListElement>(null)
  const { reduced } = useMotion()

  useGSAP(() => {
    const ol = list.current
    if (!ol || reduced) return
    gsap.fromTo('.pr-bg', { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '#principles', start: 'top bottom', end: 'bottom top', scrub: true } })
    ol.dataset.live = 'true'
    gsap.utils.toArray<HTMLElement>('.pr', ol).forEach((row) => {
      gsap.from(row.querySelectorAll('.pr-title, .pr-body, .pv'), { y: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: row, start: 'top 85%', once: true } })
      ScrollTrigger.create({ trigger: row, start: 'top 62%', end: 'bottom 62%', onToggle: (s) => { row.dataset.active = String(s.isActive) } })
      // low-amplitude parallax on the annotation only
      gsap.fromTo(row.querySelector('.pv-wrap'), { y: 30 }, { y: -30, ease: 'none', scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
    return () => { delete ol.dataset.live }
  }, { dependencies: [reduced] })

  return (
    <Section id="principles" theme="dark" className="principles">
      <PrinciplesBackdrop />
      <SectionHeading id="principles-title" title="How I build" />
      <div className="pr-wrap">
        <Rail className="pr-rail" start="top 75%" stuck />
        <ol ref={list} className="pr-list">
          {profile.principles.map((p, i) => (
            <li key={p.title} className="pr">
              <Node className="pr-node" />
              <div className="pr-text">
                <p className="t-mono mute">principle.{TAGS[i]}</p>
                <h3 className="pr-title t-h2">{p.title}</h3>
                <p className="pr-body t-lead">{p.body}</p>
              </div>
              <div className="pv-wrap"><PrincipleVisual kind={i} /></div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
