import { useState } from 'react'
import { MotionProvider } from './components/motion/MotionProvider'
import { StickyLayer } from './components/motion/StickyLayer'
import { SignatureLoader } from './components/loader/SignatureLoader'
import { CustomCursor } from './components/cursor/CustomCursor'
import { Navbar } from './components/navigation/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Principles } from './sections/Principles'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'
import { Experience } from './sections/Experience'
import { Certifications } from './sections/Certifications'
import { Contact } from './sections/Contact'

export default function App() {
  const [ready, setReady] = useState(false)
  const [loaderGone, setLoaderGone] = useState(false)
  return (
    <MotionProvider>
      <a href="#about" className="skip">Skip to content</a>
      <Navbar ready={ready} />
      <CustomCursor />
      <main>
        {/* Hero stays put; About scrolls up over it */}
        <div className="stack">
          <StickyLayer coveredBy="about"><Hero ready={ready} /></StickyLayer>
          <About />
        </div>
        {/* Principles stays put; Projects scrolls up over it (About → Principles is plain flow) */}
        <div className="stack">
          <StickyLayer coveredBy="projects"><Principles /></StickyLayer>
          <Projects />
        </div>
        {/* Skills: independent, pins only itself */}
        <Skills />
        <Experience />
        {/* Certifications stays put; Contact scrolls up over it */}
        <div className="stack">
          <StickyLayer coveredBy="contact"><Certifications /></StickyLayer>
          <Contact />
        </div>
      </main>
      <Footer />
      {!loaderGone && <SignatureLoader onExit={() => { setReady(true); window.setTimeout(() => setLoaderGone(true), 900) }} />}
    </MotionProvider>
  )
}
