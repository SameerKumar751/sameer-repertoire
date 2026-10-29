import { useRef, type PointerEvent as RPointerEvent } from 'react'
import { sectionLinks, profile } from '../../data/profile'

/** One cohesive effect: an orange fill that follows the pointer inside the outlined wordmark. */
function Wordmark() {
  const el = useRef<HTMLDivElement>(null)
  const move = (e: RPointerEvent) => {
    if (e.pointerType !== 'mouse' || !el.current) return
    const r = el.current.getBoundingClientRect()
    el.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div ref={el} className="wm" data-cursor-size="big" onPointerMove={move} aria-hidden="true">
      <span className="wm-base">SAMEER</span>
      <span className="wm-fill">SAMEER</span>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="footer on-dark">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <p className="t-h3">{profile.name}</p>
            <p className="mute t-body" style={{ marginTop: '.5rem', maxWidth: '22rem' }}>Software developer and CSE student building full-stack applications, backend systems and data-driven tools.</p>
          </div>
          <nav aria-label="Footer">
            <p className="t-mono mute">Sections</p>
            <ul>{sectionLinks.map((n) => <li key={n.id}><a href={`#${n.id}`}>{n.label}</a></li>)}</ul>
          </nav>
          <div>
            <p className="t-mono mute">Elsewhere</p>
            <ul>
              <li><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
              <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
              {profile.email && <li><a href={`mailto:${profile.email}`}>Email</a></li>}
              <li><a href="#top">Back to top ↑</a></li>
            </ul>
          </div>
        </div>
        <Wordmark />
        <p className="t-mono mute" style={{ marginTop: '1.5rem' }}>© {new Date().getFullYear()} {profile.name}</p>
      </div>
    </footer>
  )
}
