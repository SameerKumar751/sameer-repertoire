import { useRef } from 'react'
import { Section } from '../components/layout/Section'
import { Reveal } from '../components/motion/Reveal'
import { ParticlePortrait } from '../features/contact/ParticlePortrait'
import { usePointerParallax, type ParallaxTarget } from '../hooks/usePointerParallax'
import { profile } from '../data/profile'

const PARALLAX: ParallaxTarget[] = [{ sel: '.ct-l1', x: 14 }, { sel: '.ct-l2', x: -14 }]

export function Contact() {
  const root = useRef<HTMLDivElement>(null)
  usePointerParallax(root, PARALLAX)
  const links = [
    { label: 'GitHub', href: profile.github, ext: true },
    { label: 'LinkedIn', href: profile.linkedin, ext: true },
    ...(profile.email ? [{ label: 'Email', href: `mailto:${profile.email}`, ext: false }] : []),
  ]
  return (
    <Section id="contact" theme="light" className="contact">
      <div ref={root} className="contact-stage">
        <div className="contact-body">
          <Reveal variant="mask">
            <h2 id="contact-title" className="t-mega contact-title">
              <span className="mask"><span className="mask-in ct-l1">Have a problem</span></span>
              <span className="mask"><span className="mask-in ct-l2">worth solving?</span></span>
            </h2>
          </Reveal>
          <p className="t-lead contact-copy">I’m open to meaningful conversations about software, engineering, and collaborative projects.</p>
          <Reveal as="ul" variant="stagger" className="contact-links">
            {links.map((l) => (
              <li key={l.label}>
                <a className="contact-link" href={l.href} {...(l.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <span>{l.label}</span><span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </Reveal>
        </div>
        <ParticlePortrait />
      </div>
    </Section>
  )
}
