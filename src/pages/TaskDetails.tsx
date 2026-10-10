import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { getTask, updateTask } from "@/api/tasks";
import { getProjects } from "@/api/projects";
import type { CreateTaskInput } from "@/types/task";
import EditTaskForm from "@/components/EditTaskForm";

function TaskDetails() {
  const { taskId } = useParams();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    data: task,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(taskId!),
    enabled: Boolean(taskId),
  });

  const {
    data: projects = [],
    isPending: areProjectsPending,
    isError: areProjectsError,
    error: projectsError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: CreateTaskInput) =>
      updateTask(taskId!, data),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["task", taskId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        }),
      ]);

      setIsEditOpen(false);
    },
  });

  if (isPending) {
    return (
      <div className="p-8">
        <p className="text-sm text-gray-500">Loading task...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Unable to load task
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {error.message}
        </p>

        <Link
          to="/tasks"
          className="mt-4 inline-flex text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Tasks
        </Link>
      </div>
    );
  }

  const project = projects.find(
    (item) => item.id === task.projectId,
  );

  const statusStyles: Record<string, string> = {
    Todo: "bg-gray-100 text-gray-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  const priorityStyles: Record<string, string> = {
    Low: "bg-gray-100 text-gray-700",
    Medium: "bg-amber-100 text-amber-700",
    High: "bg-red-100 text-red-700",
  };

  return (
    <main className="space-y-8 p-8">
      <Link
        to="/tasks"
        className="inline-flex text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        ← Back to Tasks
      </Link>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {task.title}
            </h1>

            <p className="max-w-3xl whitespace-pre-wrap text-gray-600">
              {task.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              updateTaskMutation.reset();
              setIsEditOpen((open) => !open);
            }}
            className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            {isEditOpen ? "Close Editor" : "Edit Task"}
          </button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Status</p>

          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
              statusStyles[task.status] ?? ""
            }`}
          >
            {task.status}
          </span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Priority</p>

          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
              priorityStyles[task.priority] ?? ""
            }`}
          >
            {task.priority}
          </span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Assignee</p>

          <p className="mt-3 text-lg font-semibold text-gray-900">
            {task.assignee}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Associated Project</p>

          <p className="mt-3 text-lg font-semibold text-gray-900">
            {areProjectsPending
              ? "Loading project..."
              : areProjectsError
                ? "Unable to load project"
                : (project?.name ?? "Project not found")}
          </p>

          {areProjectsError && (
            <p className="mt-1 text-sm text-red-600">
              {projectsError.message}
            </p>
          )}
        </div>
      </section>

      {isEditOpen && (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Task
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the task details below.
            </p>
          </div>

          {areProjectsPending ? (
            <p className="text-sm text-gray-500">
              Loading projects...
            </p>
          ) : areProjectsError ? (
            <p role="alert" className="text-sm text-red-600">
              Unable to load projects: {projectsError.message}
            </p>
          ) : (
            <EditTaskForm
              key={task.id}
              task={task}
              projects={projects}
              onUpdateTask={(data) =>
                updateTaskMutation.mutate(data)
              }
              isUpdating={updateTaskMutation.isPending}
              error={
                updateTaskMutation.isError
                  ? updateTaskMutation.error.message
                  : null
              }
            />
          )}

          <button
            type="button"
            onClick={() => {
              updateTaskMutation.reset();
              setIsEditOpen(false);
            }}
            disabled={updateTaskMutation.isPending}
            className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </section>
      )}
    </main>
  );
}

export default TaskDetails;