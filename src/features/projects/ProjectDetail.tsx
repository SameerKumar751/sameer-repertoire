import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useMotion } from '../../components/motion/MotionProvider'
import { Reveal } from '../../components/motion/Reveal'
import { Node } from '../../components/thread/Rail'
import { StackExplorer } from './StackExplorer'
import type { Project } from '../../types/portfolio'

const LEDGER = ['Room booking', 'Hardware issue', 'Resource request', 'No-dues clearance']

/** Featured project. The register→system diagram is a conceptual illustration, not an app screenshot. */
export function ProjectDetail({ p }: { p: Project }) {
  const root = useRef<HTMLElement>(null)
  const { reduced } = useMotion()
  useGSAP(() => {
    if (reduced) return
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.diagram', start: 'top 80%', once: true } })
    tl.from('.ledger li', { x: -24, autoAlpha: 0, stagger: 0.1, duration: 0.55, ease: 'power3.out' })
      .from('.flow-node', { x: 24, autoAlpha: 0, stagger: 0.12, duration: 0.55, ease: 'power3.out' }, '-=0.2')
  }, { scope: root, dependencies: [reduced] })

  return (
    <article ref={root} className="pj pj-feature" aria-labelledby={`${p.id}-t`}>
      <Node className="pj-node" filled />
      <header className="pj-head">
        <Reveal variant="mask"><h3 id={`${p.id}-t`} className="t-mega pj-mega"><span className="mask"><span className="mask-in">{p.title}</span></span></h3></Reveal>
        <div className="pj-meta"><p className="status">{p.statusLabel}</p><p className="t-mono mute">{p.category}</p></div>
      </header>
      <div className="pj-cols">
        <div className="pj-main">
          <Reveal variant="stagger" className="pj-copy">
            <p className="t-lead">{p.description}</p>
            {p.contribution && <p className="t-body"><strong>My role: </strong><span className="mute">{p.contribution}</span></p>}
          </Reveal>
          <p className="t-mono mute pj-label">Functional areas in scope</p>
          <ul className="chips">{p.modules?.map((m) => <li key={m} className="chip">{m}</li>)}</ul>
          {(p.repositoryUrl || p.liveUrl) && (
            <p className="pj-links">
              {p.repositoryUrl && <a className="t-mono link" href={p.repositoryUrl} target="_blank" rel="noopener noreferrer">Repository ↗</a>}
              {p.liveUrl && <a className="t-mono link" href={p.liveUrl} target="_blank" rel="noopener noreferrer">Live ↗</a>}
            </p>
          )}
        </div>
        <figure className="diagram">
          <figcaption className="t-mono mute">From register to system — conceptual overview</figcaption>
          <ul className="ledger" aria-label="Paper-register style workflows">{LEDGER.map((l) => <li key={l}>{l}</li>)}</ul>
          <p className="t-mono mute diagram-arrow" aria-hidden="true">↓ digitised as ↓</p>
          <ul className="flow" aria-label="Application architecture">
            <li className="flow-node"><b>Client</b><span>React · Vite</span></li>
            <li className="flow-node"><b>API</b><span>Node · Express · JWT · RBAC</span></li>
            <li className="flow-node"><b>Data</b><span>MongoDB · Mongoose</span></li>
            <li className="flow-node"><b>Runtime</b><span>Docker · Compose</span></li>
          </ul>
          <p className="mute diagram-note">Application screenshots will be added once supplied.</p>
        </figure>
      </div>
      {p.stackDetails && (
        <div className="pj-stack">
          <p className="t-mono mute pj-label">Stack — select an item for its role</p>
          <StackExplorer items={p.technologies} details={p.stackDetails} />
        </div>
      )}
    </article>
  )
}
