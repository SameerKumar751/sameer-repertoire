import { useRef, useEffect } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { useMotion } from '../components/motion/MotionProvider'
import { HeroThread } from '../components/thread/HeroThread'
import { HeroDrape } from '../features/hero/HeroDrape'
import { ParticleName } from '../features/hero/ParticleName'

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const { reduced } = useMotion()

  useGSAP(() => {
    if (reduced) return
    // headline first; the thread (HeroThread, +0.7s) then draws through it; copy follows
    const t = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
    t.from('[data-hero="line"]', { yPercent: 115, duration: 1.1, stagger: 0.12 }, 0)
     .from('[data-hero="fade"]', { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.12 }, 1.0)
    tl.current = t
  }, { scope: root, dependencies: [reduced] })

  useEffect(() => { if (ready) tl.current?.play() }, [ready])

  return (
    <section id="top" ref={root} className="hero on-dark" aria-labelledby="hero-title">
      <HeroDrape active={ready} />
      <div className="hero-inner">
        <p className="t-mono mute" data-hero="fade">Sameer Kumar · B.Tech CSE · India</p>
        <div className="hero-stage">
          <HeroThread ready={ready} />
          <ParticleName text="SAMEER" />
          <h1 id="hero-title" className="t-mega hero-title">
            <span className="sr-only">Sameer Kumar: I build systems that work.</span>
            <span className="mask" aria-hidden="true"><span className="mask-in" data-hero="line">I build</span></span>
            <span className="mask" aria-hidden="true"><span className="mask-in" data-hero="line">Systems</span></span>
            <span className="mask" aria-hidden="true"><span className="mask-in" data-hero="line">That work<span className="accent">.</span></span></span>
          </h1>
        </div>
        <div className="hero-foot">
          <p className="t-lead mute hero-desc" data-hero="fade">Computer Science &amp; Engineering student building thoughtful interfaces, reliable backends, and practical software systems.</p>
          <a href="#about" className="t-mono mute hero-scroll" data-hero="fade">Scroll <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  )
}
