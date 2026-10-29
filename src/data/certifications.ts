import type { Certification } from '../types/portfolio'
/**
 * status: 'earned' | 'in-progress' | 'pending'. 'pending' = existence/status not yet confirmed by Sameer;
 * it renders as "Verification pending" and never as a verified badge.
 * Add `date` and `url` only when known. Images: public/assets/certificates/<id>.jpg
 */
export const certifications: Certification[] = [
  { id: 'genai', name: 'Generative AI Internship Certificate', status: 'earned', featured: true },
  { id: 'dp700', name: 'Microsoft DP-700', issuer: 'Microsoft', status: 'pending' },
  { id: 'oracle-agent-ai', name: 'Oracle Agent AI Certificate', issuer: 'Oracle', status: 'pending' },
]
