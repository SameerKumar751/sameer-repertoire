import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useMotion } from '../../components/motion/MotionProvider'
import { Node } from '../../components/thread/Rail'
import { profile } from '../../data/profile'
import type { Project } from '../../types/portfolio'

/** Editorial project row; alternates composition. Shows only verified information; nothing is hover-only. */
export function ProjectCard({ p, index }: { p: Project; index: number }) {
  const root = useRef<HTMLElement>(null)
  const { reduced } = useMotion()
  useGSAP(() => {
    if (reduced) return
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 85%', once: true } })
      .from('.mask-in', { yPercent: 110, duration: 0.9, ease: 'power4.out' })
      .from('.pj-side', { y: 20, autoAlpha: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
  }, { scope: root, dependencies: [reduced] })
  const href = p.repositoryUrl ?? profile.github
  return (
    <article ref={root} className="pj pj-row" data-v={index % 2 ? 'b' : 'a'} aria-labelledby={`${p.id}-t`}>
      <Node className="pj-node" />
      <h3 id={`${p.id}-t`} className="pj-title"><span className="mask"><span className="mask-in">{p.title}</span></span></h3>
      <div className="pj-side">
        {p.statusLabel && <p className={`status ${p.status === 'concept' ? 'concept' : ''}`}>{p.statusLabel}</p>}
        {p.category && <p className="t-mono mute">{p.category}</p>}
        {p.description
          ? <p className="mute t-body">{p.description}</p>
          : <a className="t-mono link" href={href} target="_blank" rel="noopener noreferrer">{p.repositoryUrl ? 'Repository' : 'See my GitHub'} ↗</a>}
      </div>
    </article>
  )
}
