import type { Project } from '@/types/project'

const API_URL = 'http://localhost:3000'

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_URL}/projects`)

  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }

  return response.json()
}