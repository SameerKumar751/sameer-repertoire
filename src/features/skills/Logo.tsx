import { ICONS } from './icons'
import type { Tech } from '../../data/skills'

export function Logo({ tech, className = '' }: { tech: Tech; className?: string }) {
  const icon = tech.icon ? ICONS[tech.icon] : undefined
  if (icon) return <svg className={`logo ${className}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d={icon.path} /></svg>
  if (tech.diagram === 'api') {
    // Original diagram (REST has no brand mark): client → endpoint → resource
    return (
      <svg className={`logo ${className}`} viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="4" aria-hidden="true" focusable="false">
        <rect x="6" y="46" width="28" height="28" /><rect x="86" y="46" width="28" height="28" />
        <path d="M34 60 H86 M72 48 L86 60 L72 72" /><circle cx="60" cy="60" r="8" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  return <span className={`logo logo-word ${className}`} aria-hidden="true">{tech.wordmark ?? tech.name}</span>
}
