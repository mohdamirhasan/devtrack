import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import type { CreateProjectInput, Project } from '../types/project.js'

const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters'),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),

  status: z.enum([
    'Planning',
    'In Progress',
    'Completed',
  ]),
})

const projects: Project[] = [
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

export async function projectRoutes(
  app: FastifyInstance,
) {
  app.get('/projects', async () => {
    return projects
  })

  app.post('/projects', async (request, reply) => {
    const result = createProjectSchema.safeParse(
      request.body,
    )

    if (!result.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: result.error.flatten(),
      })
    }

    const input: CreateProjectInput = result.data

    const newProject: Project = {
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description,
      status: input.status,
      progress: 0,
      members: 0,
    }

    projects.push(newProject)

    return reply.status(201).send(newProject)
  })
}