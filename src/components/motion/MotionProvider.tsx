import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { ScrollTrigger } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const MotionContext = createContext({ reduced: false })
export const useMotion = () => useContext(MotionContext)

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  useEffect(() => {
    // Fonts change text metrics; recompute trigger positions once they settle.
    let cancelled = false
    document.fonts?.ready.then(() => { if (!cancelled) ScrollTrigger.refresh() })
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => { cancelled = true; window.removeEventListener('load', onLoad) }
  }, [])
  return <MotionContext.Provider value={{ reduced }}>{children}</MotionContext.Provider>
}
