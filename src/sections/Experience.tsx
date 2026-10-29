import { Section } from '../components/layout/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal } from '../components/motion/Reveal'
import { Rail, Node } from '../components/thread/Rail'
import { LayerStack } from '../features/experience/LayerStack'
import { experience } from '../data/experience'

export function Experience() {
  return (
    <Section id="experience" theme="light" className="experience">
      <SectionHeading id="experience-title" title="Experience" />
      <div className="exp-grid">
        <div className="exp-wrap">
          <Rail className="exp-rail" start="top 70%" end="bottom 60%" />
          <ol className="exp-list">
            {experience.map((e) => (
              <li key={e.id} className="exp-item">
                <Node className="exp-node" filled={e.status === 'ongoing'} />
                <Reveal variant="stagger" className="exp-body">
                  <p className="t-mono status">{e.status === 'ongoing' ? 'Ongoing' : 'Completed'} · <span className="mute">{e.period}</span></p>
                  <h3 className="t-h2">{e.title}</h3>
                  {e.organisation && <p className="t-lead exp-org">{e.organisation}</p>}
                  <p className="t-body mute">{e.summary}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
        <LayerStack />
      </div>
    </Section>
  )
}
