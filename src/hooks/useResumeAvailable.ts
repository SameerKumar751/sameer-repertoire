import { useEffect, useState } from 'react'
import { ASSETS } from '../config/assets'

/** True only if the resume PDF really exists (guards against SPA fallbacks returning HTML). */
export function useResumeAvailable(): boolean {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    let alive = true
    fetch(ASSETS.resume, { method: 'HEAD' })
      .then((r) => alive && setOk(r.ok && /pdf/i.test(r.headers.get('content-type') ?? '')))
      .catch(() => alive && setOk(false))
    return () => { alive = false }
  }, [])
  return ok
}
