import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import NewProjectForm from '../components/NewProjectForm'
import { projects as initialProjects } from '../data/projects'
import type { Project } from '../types/project'

function Projects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)

  const handleCreateProject = (
    project: Omit<Project, 'id' | 'progress' | 'members'>,
  ) => {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      progress: 0,
      members: 0,
    }

    setProjects((currentProjects) => [
      ...currentProjects,
      newProject,
    ])
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Projects
        </h2>

        <p className="mt-2 text-gray-500">
          Manage and track your team's projects.
        </p>
      </div>

      <NewProjectForm onCreateProject={handleCreateProject} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </div>
  )
}

export default Projects