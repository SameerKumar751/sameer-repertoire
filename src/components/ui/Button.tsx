import type { ReactNode } from 'react'
interface Props { href: string; children: ReactNode; variant?: 'solid' | 'ghost'; external?: boolean; cursor?: string }
export function Button({ href, children, variant = 'solid', external, cursor }: Props) {
  return (
    <a href={href} className={`btn ${variant === 'solid' ? 'btn-solid' : 'btn-ghost'}`} data-cursor={cursor}
       {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}<span className="arrow" aria-hidden="true">{external ? '↗' : '→'}</span>
    </a>
  )
}
