import type { Project } from '../types/project'

type ProjectCardProps = {
  project: Project
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">
            {project.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {project.description}
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {project.status}
        </span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-gray-900">
            {project.progress}%
          </span>
        </div>

        <div className="h-2 rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-gray-900"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        {project.members} team members
      </p>
    </article>
  )
}

export default ProjectCard