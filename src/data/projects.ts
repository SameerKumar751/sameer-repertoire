import type { Project } from '../types/portfolio'

// Only verified facts are stored. Projects without a description render title-only
// until verified repository information is supplied.
export const projects: Project[] = [
  {
    id: 'kif-rms',
    title: 'KIF-RMS',
    category: 'Full-stack resource management application',
    description:
      'A resource management application designed to support institutional resource workflows, including resource requests, room management, inventory-related operations, and administrative processes.',
    status: 'in-development',
    statusLabel: 'In development',
    technologies: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'Docker', 'Docker Compose', 'JWT', 'Refresh tokens', 'RBAC'],
    contribution: 'Working on the application during my ongoing internship at KIF KPM Incubation Foundation.',
    modules: ['Cabins & resources', 'Rooms', 'Hardware', 'Consumables', 'Resource requests', 'Events', 'Notifications', 'Users', 'Analytics', 'Audit logs', 'No-dues workflows'],
    stackDetails: {
      'React': 'Builds the client interface of the application.',
      'Vite': 'Development server and build tooling for the React client.',
      'Node.js': 'Runtime for the backend API.',
      'Express': 'Provides the HTTP routing layer of the API.',
      'MongoDB': 'Document database that stores the application’s data.',
      'Mongoose': 'Defines the data models and handles queries to MongoDB.',
      'Docker': 'Packages the services so they run the same way everywhere.',
      'Docker Compose': 'Defines and starts the multi-service setup together.',
      'JWT': 'Token-based authentication used in the project’s authentication design.',
      'Refresh tokens': 'Refresh-token architecture for renewing sessions.',
      'RBAC': 'Role-based access control: what a user can do depends on their role.',
    },
    featured: true,
  },
  { id: 'bharat-darshan', title: 'Bharat Darshan', technologies: [] },
  {
    id: 'crowd-management',
    title: 'Temple / Pilgrimage Crowd Management System',
    category: 'Proposed system',
    description:
      'A proposed crowd-management solution for temples and pilgrimage sites, developed through a college-level hackathon process where the idea reached an internal selection stage. It is a concept, not a deployed application.',
    status: 'concept',
    statusLabel: 'Concept',
    technologies: [],
  },
  { id: 'quandetect', title: 'QuanDetect', technologies: [] },
]
