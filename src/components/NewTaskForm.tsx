import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { CreateTaskInput } from "@/types/task";
import type { Project } from "@/types/project";

const taskSchema = z.object({
  title: z.string().min(3, "Task title must be at least 3 characters"),

  description: z.string().min(10, "Description must be at least 10 characters"),

  status: z.enum(["Todo", "In Progress", "Completed"]),

  priority: z.enum(["Low", "Medium", "High"]),

  projectId: z.string().min(1, "Project is required"),

  assignee: z.string().min(1, "Assignee is required"),
});

type TaskFormData = z.infer<typeof taskSchema>;

type NewTaskFormProps = {
  projects: Project[];
  onCreateTask: (task: CreateTaskInput) => void;
  isCreating: boolean;
  error: string | null;
};

function NewTaskForm({
  projects,
  onCreateTask,
  isCreating,
  error,
}: NewTaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: "Todo",
      priority: "Medium",
      projectId: "1",
    },
  });

  const onSubmit = (data: TaskFormData) => {
    onCreateTask(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="task-title"
          className="mb-2 block text-sm font-medium text-gray-700">
          Task Title
        </label>

        <input
          id="task-title"
          type="text"
          {...register("title")}
          placeholder="Enter task title"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-gray-900"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="task-description"
          className="mb-2 block text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          id="task-description"
          rows={4}
          {...register("description")}
          placeholder="Describe the task"
          className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-gray-900"
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="task-status"
            className="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            id="task-status"
            {...register("status")}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-gray-900">
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="task-priority"
            className="mb-2 block text-sm font-medium text-gray-700">
            Priority
          </label>

          <select
            id="task-priority"
            {...register("priority")}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-gray-900">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="task-project"
          className="mb-2 block text-sm font-medium text-gray-700">
          Project
        </label>

        <select
          id="task-project"
          {...register("projectId")}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-gray-900">
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        {errors.projectId && (
          <p className="mt-1 text-sm text-red-600">
            {errors.projectId.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="task-assignee"
          className="mb-2 block text-sm font-medium text-gray-700">
          Assignee
        </label>

        <input
          id="task-assignee"
          type="text"
          {...register("assignee")}
          placeholder="Enter assignee name"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-gray-900"
        />

        {errors.assignee && (
          <p className="mt-1 text-sm text-red-600">{errors.assignee.message}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isCreating}
        className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50">
        {isCreating ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}

export default NewTaskForm;
