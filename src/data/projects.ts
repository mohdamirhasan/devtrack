import type { Project } from '../types/project'

export const projects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Redesign the company marketing website.',
    status: 'In Progress',
    progress: 65,
    members: 4,
  },
  {
    id: '2',
    name: 'Mobile Application',
    description: 'Build the new mobile application.',
    status: 'Planning',
    progress: 20,
    members: 3,
  },
  {
    id: '3',
    name: 'API Migration',
    description: 'Migrate legacy APIs to the new platform.',
    status: 'Completed',
    progress: 100,
    members: 5,
  },
]