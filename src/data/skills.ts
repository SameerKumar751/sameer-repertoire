export interface Tech { name: string; icon?: string; wordmark?: string; diagram?: 'api'; projects?: string[] }
export interface Category { id: string; label: string; items: Tech[]; /** listed beneath the category; concepts/tools without a brand logo */ also?: string[] }
const K = ['KIF-RMS']
export const categories: Category[] = [
  { id: 'lang', label: 'Programming Languages', items: [
    { name: 'Python', icon: 'python' }, { name: 'Java', wordmark: 'Java' }, { name: 'JavaScript', icon: 'javascript' },
    { name: 'HTML', icon: 'html5' }, { name: 'CSS', icon: 'css3' } ] },
  { id: 'fw', label: 'Frameworks & Libraries', items: [
    { name: 'React.js', icon: 'react', projects: K }, { name: 'Vue.js', icon: 'vue' }, { name: 'Next.js', icon: 'next' },
    { name: 'Vite', icon: 'vite', projects: K }, { name: 'Tailwind CSS', icon: 'tailwind' } ] },
  { id: 'api', label: 'Backend & APIs', items: [
    { name: 'Node.js', icon: 'node', projects: K }, { name: 'Express.js', icon: 'express', projects: K },
    { name: 'FastAPI', icon: 'fastapi' }, { name: 'REST APIs', diagram: 'api', projects: K } ],
    also: ['JWT authentication', 'Refresh-token workflows', 'Role-based access control'] },
  { id: 'data', label: 'Databases & Data', items: [
    { name: 'MongoDB', icon: 'mongodb', projects: K }, { name: 'Mongoose', icon: 'mongoose', projects: K },
    { name: 'SQL', wordmark: 'SQL' }, { name: 'Tableau', icon: 'tableau' } ],
    also: ['Microsoft Excel', 'Data engineering concepts', 'Generative AI', 'AI & machine learning concepts'] },
  { id: 'tools', label: 'Tools & Version Control', items: [
    { name: 'Git', icon: 'git' }, { name: 'GitHub', icon: 'github' },
    { name: 'Docker', icon: 'docker', projects: K }, { name: 'Kubernetes', icon: 'kubernetes' } ],
    also: ['Docker Compose'] },
]
