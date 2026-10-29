import { useId, useState } from 'react'

/** Compact, keyboard- and touch-friendly stack list; one description panel expands/collapses beneath. */
export function StackExplorer({ items, details }: { items: string[]; details: Record<string, string> }) {
  const [active, setActive] = useState<string | null>(null)
  const [shown, setShown] = useState<string | null>(null) // keeps text while collapsing
  const panel = useId()
  const toggle = (t: string) => { const next = active === t ? null : t; setActive(next); if (next) setShown(next) }
  return (
    <div className="stack-ex">
      <ul className="chips">
        {items.map((t) => (
          <li key={t}>
            <button type="button" className={`chip chip-strong chip-btn ${active === t ? 'is-active' : ''}`} aria-expanded={active === t} aria-controls={panel} onClick={() => toggle(t)}>{t}</button>
          </li>
        ))}
      </ul>
      <div id={panel} className={`stack-panel ${active ? 'open' : ''}`} role="region" aria-live="polite" aria-label="Technology role">
        <div className="stack-panel-in"><p className="t-mono mute">{shown}</p><p className="t-body">{shown ? details[shown] : ''}</p></div>
      </div>
    </div>
  )
}
