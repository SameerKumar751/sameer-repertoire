import { Reveal } from '../motion/Reveal'
/** Section title only — no numeric prefixes. */
export function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <Reveal variant="mask" className="section-heading">
      <h2 id={id} className="t-h1"><span className="mask"><span className="mask-in">{title}</span></span></h2>
    </Reveal>
  )
}
