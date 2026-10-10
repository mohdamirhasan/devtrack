import type { FastifyInstance } from "fastify";
import type { Task } from "../types/task.js";
import { z } from "zod";

const deadlineSchema = z.iso.date("Deadline must be a valid date in YYYY-MM-DD format");

const createTaskSchema = z.object({
  title: z.string().min(3, "Task title must be at least 3 characters"),

  description: z.string().min(10, "Description must be at least 10 characters"),

  status: z.enum(["Todo", "In Progress", "Completed"]),

  priority: z.enum(["Low", "Medium", "High"]),

  projectId: z.string().min(1, "Project is required"),

  assignee: z.string().min(1, "Assignee is required"),

  deadline: deadlineSchema,
});

const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Task title must be at least 3 characters")
    .optional(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),

  status: z.enum(["Todo", "In Progress", "Completed"]).optional(),

  priority: z.enum(["Low", "Medium", "High"]).optional(),

  projectId: z.string().min(1, "Project is required").optional(),

  assignee: z.string().min(1, "Assignee is required").optional(),

  deadline: deadlineSchema.optional(),
});

const tasks: Task[] = [
  {
    id: "1",
    title: "Design landing page",
    description: "Create the initial design for the landing page.",
    status: "In Progress",
    priority: "High",
    projectId: "1",
    assignee: "Amir",
    deadline: "2026-10-20",
  },
  {
    id: "2",
    title: "Set up authentication",
    description: "Implement login and authentication flow.",
    status: "Todo",
    priority: "High",
    projectId: "1",
    assignee: "Developer 2",
    deadline: "2026-10-25",
  },
  {
    id: "3",
    title: "Create database schema",
    description: "Design the initial database structure.",
    status: "Completed",
    priority: "Medium",
    projectId: "2",
    assignee: "Developer 3",
    deadline: "2026-10-15",
  },
];

export async function taskRoutes(app: FastifyInstance) {
  app.get("/tasks", async () => {
    return tasks;
  });

  app.get("/tasks/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const task = tasks.find((task) => task.id === id);

    if (!task) {
      return reply.status(404).send({
        error: "Task not found",
      });
    }

    return task;
  });

  app.post("/tasks", async (request, reply) => {
    const result = createTaskSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: "Validation failed",
        details: result.error.flatten(),
      });
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: result.data.title,
      description: result.data.description,
      status: result.data.status,
      priority: result.data.priority,
      projectId: result.data.projectId,
      assignee: result.data.assignee,
      deadline: result.data.deadline,
    };

    tasks.push(newTask);

    return reply.status(201).send(newTask);
  });
  app.patch("/tasks/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const task = tasks.find((task) => task.id === id);

    if (!task) {
      return reply.status(404).send({
        error: "Task not found",
      });
    }

    const result = updateTaskSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: "Validation failed",
        details: result.error.flatten(),
      });
    }

    Object.assign(task, result.data);

    return reply.status(200).send(task);
  });

  app.delete("/tasks/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      return reply.status(404).send({
        error: "Task not found",
      });
    }

    const [deletedTask] = tasks.splice(taskIndex, 1);

    return reply.status(200).send(deletedTask);
  });
}
