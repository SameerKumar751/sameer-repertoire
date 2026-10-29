import type { ReactNode } from 'react'
interface Props { id: string; theme: 'dark' | 'light'; children: ReactNode; className?: string }
export function Section({ id, theme, children, className = '' }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`section on-${theme} ${className}`}>
      <div className="wrap">{children}</div>
    </section>
  )
}
