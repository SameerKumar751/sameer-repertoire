/** Single source of truth for replaceable assets. Files live in /public (served from the site root). */
export const ASSETS = {
  /** Replace public/resume.pdf with the real resume — no code change needed. */
  resume: '/resume.pdf',
  /** Contact portrait source. Replace public/assets/sameer-portrait.jpg; tune the crop in features/contact/ParticlePortrait.tsx. */
  portrait: '/assets/sameer-portrait.jpg',
  ogImage: '/og-image.jpg',
  certificate: (id: string) => `/assets/certificates/${id}.jpg`,
  projectImage: (id: string) => `/assets/projects/${id}.jpg`,
} as const
