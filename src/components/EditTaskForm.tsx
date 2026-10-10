import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Task } from "@/types/task";
import type { Project } from "@/types/project";

const editTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Task title must be at least 3 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  status: z.enum(["Todo", "In Progress", "Completed"]),

  priority: z.enum(["Low", "Medium", "High"]),

  projectId: z.string().min(1, "Please select a project"),

  assignee: z
    .string()
    .trim()
    .min(1, "Assignee is required"),

  deadline: z.iso.date("Please select a valid deadline"),
});

type EditTaskFormData = z.infer<typeof editTaskSchema>;

type EditTaskFormProps = {
  task: Task;
  projects: Project[];
  onUpdateTask: (data: EditTaskFormData) => void;
  isUpdating: boolean;
  error: string | null;
};

function EditTaskForm({
  task,
  projects,
  onUpdateTask,
  isUpdating,
  error,
}: EditTaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditTaskFormData>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      projectId: task.projectId,
      assignee: task.assignee,
      deadline: task.deadline,
    },
  });

  const onSubmit = (data: EditTaskFormData) => {
    onUpdateTask(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="edit-task-title"
          className="block text-sm font-medium text-gray-700"
        >
          Task title
        </label>

        <input
          id="edit-task-title"
          type="text"
          {...register("title")}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-600">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="edit-task-description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="edit-task-description"
          rows={4}
          {...register("description")}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
  <label
    htmlFor="edit-task-deadline"
    className="block text-sm font-medium text-gray-700"
  >
    Deadline
  </label>

  <input
    id="edit-task-deadline"
    type="date"
    {...register("deadline")}
    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
  />

  {errors.deadline && (
    <p className="mt-1 text-sm text-red-600">
      {errors.deadline.message}
    </p>
  )}
</div>

      <div>
        <label
          htmlFor="edit-task-status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>

        <select
          id="edit-task-status"
          {...register("status")}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {errors.status && (
          <p className="mt-1 text-sm text-red-600">
            {errors.status.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="edit-task-priority"
          className="block text-sm font-medium text-gray-700"
        >
          Priority
        </label>

        <select
          id="edit-task-priority"
          {...register("priority")}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {errors.priority && (
          <p className="mt-1 text-sm text-red-600">
            {errors.priority.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="edit-task-project"
          className="block text-sm font-medium text-gray-700"
        >
          Project
        </label>

        <select
          id="edit-task-project"
          {...register("projectId")}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="">Select a project</option>

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
          htmlFor="edit-task-assignee"
          className="block text-sm font-medium text-gray-700"
        >
          Assignee
        </label>

        <input
          id="edit-task-assignee"
          type="text"
          {...register("assignee")}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
        />

        {errors.assignee && (
          <p className="mt-1 text-sm text-red-600">
            {errors.assignee.message}
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isUpdating}
        className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUpdating ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

export default EditTaskForm;