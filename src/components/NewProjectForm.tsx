import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { Project } from '../types/project'

const projectSchema = z.object({
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters'),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),

  status: z.enum(['Planning', 'In Progress', 'Completed']),
})

type ProjectFormData = z.infer<typeof projectSchema>

type NewProjectFormProps = {
  onCreateProject: (
    project: Omit<Project, 'id' | 'progress' | 'members'>,
  ) => void
}

function NewProjectForm({
  onCreateProject,
}: NewProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'Planning',
    },
  })

  const onSubmit = (data: ProjectFormData) => {
    onCreateProject(data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          New Project
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Create a new project for your team.
        </p>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Project name
        </label>

        <input
          id="name"
          type="text"
          {...register('name')}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
          placeholder="e.g. Website Redesign"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
          placeholder="What is this project about?"
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>

        <select
          id="status"
          {...register('status')}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Create Project
      </button>
    </form>
  )
}

export default NewProjectForm