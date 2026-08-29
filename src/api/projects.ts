import type { Project } from '@/types/project'
import { projects } from '@/data/projects'

export async function getProjects(): Promise<Project[]> {
  return projects
}