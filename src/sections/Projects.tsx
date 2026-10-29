import { useRef } from 'react'
import { useTitleTilt } from '../hooks/useTitleTilt'
import { Section } from '../components/layout/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Rail } from '../components/thread/Rail'
import { ProjectDetail } from '../features/projects/ProjectDetail'
import { ProjectCard } from '../features/projects/ProjectCard'
import { projects } from '../data/projects'

export function Projects() {
  const featured = projects.find((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)
  const list = useRef<HTMLDivElement>(null)
  useTitleTilt(list, '.pj-mega, .pj-title')
  return (
    <Section id="projects" theme="light" className="projects">
      <SectionHeading id="projects-title" title="Projects" />
      <div ref={list} className="pj-list">
        <Rail className="pj-rail" start="top 70%" end="bottom 50%" />
        {featured && <ProjectDetail p={featured} />}
        {rest.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
      </div>
    </Section>
  )
}
