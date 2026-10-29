import { useEffect, useRef } from 'react'
import { ASSETS } from '../../config/assets'
import { profile } from '../../data/profile'
import { useResumeAvailable } from '../../hooks/useResumeAvailable'

export function Navbar({ ready }: { ready: boolean }) {
  const hasResume = useResumeAvailable()
  const el = useRef<HTMLElement>(null)
  // stable scroll state: only the border strengthens (class toggle, no re-render, no size change)
  useEffect(() => {
    const on = () => el.current?.classList.toggle('is-scrolled', window.scrollY > 8)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header ref={el} className={`nav ${ready ? 'is-ready' : ''}`}>
      <a href="#top" className="nav-brand t-mono" aria-label={`${profile.name} — back to top`}>{profile.name}</a>
      <nav aria-label="Primary" className="nav-actions">
        <a className="nav-btn" href="#contact"><span>Contact</span><span className="nav-arrow" aria-hidden="true">↘</span></a>
        {hasResume ? (
          <a className="nav-btn" href={ASSETS.resume} target="_blank" rel="noopener noreferrer" download="Sameer-Kumar-Resume.pdf">
            <span>Resume</span><span className="nav-arrow" aria-hidden="true">↓</span>
          </a>
        ) : (
          <button type="button" className="nav-btn is-pending" aria-disabled="true" title="Resume PDF has not been added yet">
            <span>Resume</span><span className="sr-only"> (not yet available)</span>
          </button>
        )}
      </nav>
    </header>
  )
}
