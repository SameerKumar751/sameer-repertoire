import { useRef, type MouseEvent as RMouseEvent } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { useMotion } from '../components/motion/MotionProvider'
import { categories } from '../data/skills'
import { Logo } from '../features/skills/Logo'

const items = categories.flatMap((c, ci) => c.items.map((t) => ({ t, ci, label: c.label })))
const N = items.length
const UNIT = 0.3 // viewport heights of scroll per technology (0.26 on phones)
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const ease = (v: number) => v * v * (3 - 2 * v)

/**
 * Scroll-driven showcase. A SINGLE scrubbed tween moves one continuous value `t` (0 … N-1). Every visual state is a pure
 * function of t: logo i has distance d = t - i; opacity/scale/offset vary smoothly with |d|, so there are no discrete
 * jumps, nothing re-triggers on re-entry, and reversing scroll reverses exactly. Category title, ticks, progress bar and the
 * live-region text are derived from the same t, so they always agree with the visible logo.
 */
export function Skills() {
  const root = useRef<HTMLElement>(null)
  const { reduced } = useMotion()

  useGSAP(() => {
    const el = root.current
    if (!el || reduced) return
    const nodes: HTMLElement[] = Array.from(el.querySelectorAll<HTMLElement>('[data-i]'))
    const cats: HTMLElement[] = Array.from(el.querySelectorAll<HTMLElement>('[data-cat]'))
    const ticks: HTMLElement[] = Array.from(el.querySelectorAll<HTMLElement>('[data-tick]'))
    const fill = el.querySelector<HTMLElement>('.sk-fill')
    const live = el.querySelector<HTMLElement>('.sk-live')
    let lastIdx = -1
    const render = (t: number) => {
      const co = categories.map(() => 0)
      nodes.forEach((node, i) => {
        const d = t - i, ad = Math.abs(d)
        const o = ease(clamp((0.8 - ad) / 0.55)) // fully in focus for |d| < .25, gone at |d| >= .8
        co[items[i].ci] += o
        if (o <= 0.001) { node.style.visibility = 'hidden'; node.style.opacity = '0'; return }
        node.style.visibility = 'visible'
        node.style.opacity = String(o)
        node.style.transform = `translate(0,-50%) translate3d(0,${(-d * 34).toFixed(1)}px,0) scale(${(1 - 0.18 * Math.min(ad, 1)).toFixed(4)})`
      })
      cats.forEach((c, k) => { const v = clamp(co[k]); c.style.opacity = String(v); c.style.transform = `translate3d(0,${((1 - v) * 14).toFixed(1)}px,0)` })
      ticks.forEach((tk, k) => { tk.style.opacity = String(0.45 + 0.55 * clamp(co[k])) })
      if (fill) fill.style.transform = `scaleX(${(t / (N - 1)).toFixed(4)})`
      const idx = Math.min(N - 1, Math.max(0, Math.round(t)))
      if (idx !== lastIdx && live) { lastIdx = idx; live.textContent = `${items[idx].t.name} — ${items[idx].label}` }
    }
    const proxy = { t: 0 }
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.sk-pin', pin: true, scrub: 0.35, start: 'top top', anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 10,
        end: () => `+=${Math.round((N - 0.5) * window.innerHeight * (window.innerWidth < 700 ? UNIT * 0.87 : UNIT))}`,
      },
    })
    tl.to(proxy, { t: N - 1, duration: N - 1, onUpdate: () => render(proxy.t) }, 0)
    tl.to({}, { duration: 0.5 }, N - 1) // short hold on the last technology
    render(0)
  }, { scope: root, dependencies: [reduced] })

  const skip = (e: RMouseEvent) => {
    e.preventDefault()
    document.getElementById('experience')?.scrollIntoView({ block: 'start' })
  }

  return (
    <section id="skills" ref={root} className="sk on-dark" aria-labelledby="skills-title">
      <div className="sk-pin">
        <h2 id="skills-title" className="sk-head t-mono">Skills &amp; technologies</h2>
        {/* Always-present text equivalent for assistive tech; visible as a static list under reduced motion */}
        <div className={reduced ? 'sk-static' : 'sr-only'}>
          {categories.map((c) => (
            <div key={c.id} className="sk-group">
              <h3 className="t-h3">{c.label}</h3>
              <ul className="chips">
                {c.items.map((t) => <li key={t.name} className="chip chip-strong">{t.name}{t.projects ? ` · used in ${t.projects.join(', ')}` : ''}</li>)}
                {c.also?.map((a) => <li key={a} className="chip">{a}</li>)}
              </ul>
            </div>
          ))}
        </div>
        {!reduced && (
          <div className="sk-stage" aria-hidden="true">
            {categories.map((c, ci) => (
              <div key={c.id} className="sk-cat" data-cat={ci}>
                <p className="sk-cat-title">{c.label}</p>
                {c.also && <p className="t-mono mute sk-also">Also: {c.also.join(' · ')}</p>}
              </div>
            ))}
            {items.map(({ t, label }, i) => (
              <div key={t.name} className="sk-item" data-i={i}>
                <Logo tech={t} />
                <p className="sk-name">{t.name}</p>
                <p className="t-mono mute">{label}{t.projects ? ` · used in ${t.projects.join(', ')}` : ''}</p>
              </div>
            ))}
            <div className="sk-progress">
              <div className="sk-track"><span className="sk-fill" /></div>
              <div className="sk-ticks">{categories.map((c, ci) => <span key={c.id} className="sk-tick" data-tick={ci}>{c.label.split(' ')[0]}</span>)}</div>
            </div>
          </div>
        )}
        {!reduced && <p className="sr-only sk-live" aria-live="polite" />}
        {!reduced && <a href="#experience" onClick={skip} className="sk-skip t-mono">Skip technologies ↓</a>}
      </div>
    </section>
  )
}
