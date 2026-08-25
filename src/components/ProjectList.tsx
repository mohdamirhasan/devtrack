import type { Project } from '../types/project'
import ProjectCard from './ProjectCard'

type ProjectListProps = {
  projects: Project[]
}

function ProjectList({ projects }: ProjectListProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Projects
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Your team's latest projects.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </section>
  )
}

export default ProjectList