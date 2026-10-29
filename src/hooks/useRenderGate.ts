import { useEffect, useRef } from 'react'

/** ref.current is true only while the tab is visible AND `coverId` has not scrolled over the (sticky) hero. */
export function useRenderGate(coverId: string) {
  const on = useRef(true)
  useEffect(() => {
    let covered = false, hidden = document.hidden
    const upd = () => { on.current = !covered && !hidden }
    const vis = () => { hidden = document.hidden; upd() }
    const scroll = () => { const c = document.getElementById(coverId); covered = !!c && c.getBoundingClientRect().top <= 0; upd() }
    document.addEventListener('visibilitychange', vis)
    window.addEventListener('scroll', scroll, { passive: true })
    scroll()
    return () => { document.removeEventListener('visibilitychange', vis); window.removeEventListener('scroll', scroll) }
  }, [coverId])
  return on
}
