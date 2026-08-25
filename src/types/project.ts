export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed'

export type Project = {
  id: string
  name: string
  description: string
  status: ProjectStatus
  progress: number
  members: number
}