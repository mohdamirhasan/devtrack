import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Project } from "@/types/project";

const editProjectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  status: z.enum(["Planning", "In Progress", "Completed"]),

  progress: z
    .number()
    .min(0)
    .max(100),

  members: z
    .number()
    .int()
    .min(0),
});

type EditProjectFormData = z.infer<typeof editProjectSchema>;

type EditProjectFormProps = {
  project: Project;
  onUpdateProject: (data: EditProjectFormData) => void;
  isUpdating: boolean;
  error: string | null;
};

function EditProjectForm({
  project,
  onUpdateProject,
  isUpdating,
  error,
}: EditProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProjectFormData>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
      status: project.status,
      progress: project.progress,
      members: project.members,
    },
  });

  const onSubmit = (data: EditProjectFormData) => {
    onUpdateProject(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="edit-name"
          className="block text-sm font-medium text-gray-700"
        >
          Project name
        </label>

        <input
          id="edit-name"
          type="text"
          {...register("name")}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="edit-description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="edit-description"
          {...register("description")}
          rows={4}
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
          htmlFor="edit-status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>

        <select
          id="edit-status"
          {...register("status")}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="edit-progress"
          className="block text-sm font-medium text-gray-700"
        >
          Progress
        </label>

        <input
          id="edit-progress"
          type="number"
          {...register("progress", { valueAsNumber: true })}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
        />

        {errors.progress && (
          <p className="mt-1 text-sm text-red-600">
            {errors.progress.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="edit-members"
          className="block text-sm font-medium text-gray-700"
        >
          Team members
        </label>

        <input
          id="edit-members"
          type="number"
          {...register("members", { valueAsNumber: true })}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
        />

        {errors.members && (
          <p className="mt-1 text-sm text-red-600">
            {errors.members.message}
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">
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

export default EditProjectForm;