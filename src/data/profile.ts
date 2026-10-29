export const profile = {
  name: 'Sameer Kumar',
  firstName: 'Sameer',
  location: 'Uttar Pradesh, India',
  github: 'https://github.com/sameerkumar751',
  linkedin: 'https://www.linkedin.com/in/sameer-kumar-31225941b/',
  /** Add a professional email here to enable email links in Contact and Footer. */
  email: undefined as string | undefined,
  principles: [
    { title: 'Build for real use', body: 'Software should solve a real problem, not just demonstrate a technology.' },
    { title: 'Make complexity understandable', body: 'Good interfaces make complex workflows easier to navigate.' },
    { title: 'Understand the system', body: 'Frontend, backend, data, and permissions are connected parts of one product.' },
    { title: 'Keep improving', body: 'Building, testing, and refining are all part of the engineering process.' },
  ],
}
/** Footer-only section links. Every id must exist in the page. */
export const sectionLinks = [
  { id: 'about', label: 'About' },
  { id: 'principles', label: 'Principles' },
  { id: 'projects', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
]
