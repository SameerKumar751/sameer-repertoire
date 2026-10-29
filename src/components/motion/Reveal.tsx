import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useMotion } from './MotionProvider'
import { EASE, REVEAL_START } from '../../lib/animation-utils'

interface Props {
  children: ReactNode
  as?: ElementType
  className?: string
  /** fade: rise + fade. mask: text slides up inside an overflow mask. stagger: animate direct children. */
  variant?: 'fade' | 'mask' | 'stagger'
  delay?: number
}

export function Reveal({ children, as: Tag = 'div', className, variant = 'fade', delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { reduced } = useMotion()

  useGSAP(() => {
    const el = ref.current
    if (!el || reduced) return
    const st = { trigger: el, start: REVEAL_START, once: true }
    if (variant === 'mask') {
      const inner = el.querySelectorAll('.mask-in')
      gsap.from(inner, { yPercent: 110, duration: 1, ease: EASE.out, stagger: 0.1, delay, scrollTrigger: st })
    } else if (variant === 'stagger') {
      gsap.from(el.children, { y: 36, autoAlpha: 0, duration: 0.8, ease: EASE.soft, stagger: 0.09, delay, scrollTrigger: st })
    } else {
      gsap.from(el, { y: 36, autoAlpha: 0, duration: 0.9, ease: EASE.soft, delay, scrollTrigger: st })
    }
  }, { scope: ref, dependencies: [reduced, variant] })

  return <Tag ref={ref} className={className}>{children}</Tag>
}
