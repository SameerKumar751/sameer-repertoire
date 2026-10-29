import { useRef } from 'react'
import { Section } from '../components/layout/Section'
import { Reveal } from '../components/motion/Reveal'
import { Rail } from '../components/thread/Rail'
import { AboutDiagram } from '../features/about/AboutDiagram'
import { usePointerParallax, type ParallaxTarget } from '../hooks/usePointerParallax'

// damped (quickTo) parallax; text blocks are not targets, so heading/description stay stable
const PARALLAX: ParallaxTarget[] = [{ sel: '.about-diagram', x: -16, y: -10 }, { sel: '.about-cross', x: 22, y: 14 }, { sel: '.about-grid-bg', x: -8, y: -6 }]

export function About() {
  const root = useRef<HTMLDivElement>(null)
  usePointerParallax(root, PARALLAX)
  return (
    <Section id="about" theme="light" className="about">
      <div ref={root} className="about-body">
        <div className="about-grid-bg" aria-hidden="true" />
        <Rail className="about-rail" head start="top 80%" end="bottom 45%" />
        <svg className="about-cross" viewBox="0 0 80 80" aria-hidden="true" focusable="false"><path d="M40 0V80M0 40H80" /><circle cx="40" cy="40" r="14" /></svg>
        <div className="about-grid">
          <div className="about-left">
            <Reveal variant="mask">
              <h2 id="about-title" className="t-h1 about-title">
                <span className="mask"><span className="mask-in">Hi, I’m</span></span>
                <span className="mask"><span className="mask-in"><span className="about-accent">Sameer.</span></span></span>
              </h2>
            </Reveal>
            <AboutDiagram />
          </div>
          <Reveal variant="stagger" className="about-copy t-lead">
            <p>I’m a Computer Science and Engineering student who enjoys turning ideas into practical software. My work spans frontend experiences, backend systems, and applications that make complex workflows easier to use.</p>
            <p>Through project work and internships, I’m developing a practical understanding of how software is designed, built, and maintained. I care about thoughtful interfaces, reliable systems, and the engineering decisions that make products useful in the real world.</p>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
