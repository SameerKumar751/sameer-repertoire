export interface Project {
  id: string
  title: string
  category?: string
  description?: string
  status?: 'in-development' | 'concept'
  statusLabel?: string
  technologies: string[]
  contribution?: string
  image?: string
  repositoryUrl?: string
  liveUrl?: string
  featured?: boolean
  modules?: string[]
  /** short role of each stack item in the project; keys must match `technologies` */
  stackDetails?: Record<string, string>
}
export interface SkillItem { name: string; core?: boolean; projects?: string[] }
export interface SkillGroup { id: string; label: string; items: SkillItem[] }
export interface Experience {
  id: string
  title: string
  organisation?: string
  status: 'completed' | 'ongoing'
  period: string
  summary: string
  certificateUrl?: string
}
export interface Certification {
  id: string
  name: string
  issuer?: string
  status: 'earned' | 'in-progress' | 'pending'
  date?: string
  url?: string
  featured?: boolean
}
