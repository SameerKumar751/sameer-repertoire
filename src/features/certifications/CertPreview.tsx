import { useState } from 'react'
import { ASSETS } from '../../config/assets'
import type { Certification } from '../../types/portfolio'

/** Certificate image with a designed typographic fallback underneath (never a broken-image icon). */
export function CertPreview({ cert }: { cert: Certification }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="cp">
      <div className="cp-fallback" aria-hidden={loaded}>
        <span className="t-mono">Certificate</span>
        <strong>{cert.name}</strong>
        {cert.issuer && <span className="t-mono">{cert.issuer}</span>}
      </div>
      {!failed && (
        <img className={`cp-img ${loaded ? 'on' : ''}`} src={ASSETS.certificate(cert.id)} alt={`${cert.name} certificate`} loading="lazy" decoding="async"
             onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
      )}
    </div>
  )
}
