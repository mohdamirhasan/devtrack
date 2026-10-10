import { useState } from "react";
import {
  Link,
  useParams,
} from "react-router";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getTask, updateTask } from "@/api/tasks";
import { getProjects } from "@/api/projects";
import EditTaskForm from "@/components/EditTaskForm";
import type { CreateTaskInput } from "@/types/task";

export default function TaskDetails() {
  const { taskId } = useParams();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: task,
    isLoading: isTaskLoading,
    error: taskError,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(taskId!),
    enabled: Boolean(taskId),
  });

  const {
    data: projects = [],
    isLoading: isProjectsLoading,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: CreateTaskInput) =>
      updateTask(taskId!, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      setIsEditing(false);
    },
  });

  if (isTaskLoading || isProjectsLoading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-gray-500">Loading task details...</p>
      </main>
    );
  }

  if (taskError || !task) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-red-600">
          {taskError instanceof Error
            ? taskError.message
            : "Task not found."}
        </p>

        <Link
          to="/tasks"
          className="mt-4 inline-block text-sm font-medium text-gray-900 underline"
        >
          Back to Tasks
        </Link>
      </main>
    );
  }

  const project = projects.find(
    (project) => project.id === task.projectId,
  );

  // Format today's date as YYYY-MM-DD for a date-only comparison.
  const today = new Date();

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  // Avoid timezone shifts when formatting a date-only value.
  const formattedDeadline = new Intl.DateTimeFormat(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  ).format(new Date(`${task.deadline}T00:00:00`));

  const isOverdue =
    task.status !== "Completed" &&
    task.deadline < todayString;

  const statusClasses: Record<string, string> = {
    Todo: "bg-gray-100 text-gray-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  const priorityClasses: Record<string, string> = {
    Low: "bg-gray-100 text-gray-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-red-100 text-red-700",
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      {/* Navigation */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          to="/tasks"
          className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          ← Back to Tasks
        </Link>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Edit Task
          </button>
        )}
      </div>

      {/* Task heading */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                statusClasses[task.status] ??
                "bg-gray-100 text-gray-700"
              }`}
            >
              {task.status}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                priorityClasses[task.priority] ??
                "bg-gray-100 text-gray-700"
              }`}
            >
              {task.priority} Priority
            </span>

            {isOverdue && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                Overdue
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {task.title}
          </h1>

          <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-600">
            {task.description}
          </p>
        </div>

        {/* Task information */}
        <div className="grid gap-6 border-t border-gray-200 pt-6 sm:grid-cols-2">
          {/* Status */}
          <div>
            <p className="text-sm text-gray-500">
              Status
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {task.status}
            </p>
          </div>

          {/* Priority */}
          <div>
            <p className="text-sm text-gray-500">
              Priority
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {task.priority}
            </p>
          </div>

          {/* Assignee */}
          <div>
            <p className="text-sm text-gray-500">
              Assignee
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {task.assignee}
            </p>
          </div>

          {/* Project */}
          <div>
            <p className="text-sm text-gray-500">
              Project
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {project?.name ?? "Unknown project"}
            </p>
          </div>

          {/* Deadline */}
          <div>
            <p className="text-sm text-gray-500">
              Deadline
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p
                className={`font-medium ${
                  isOverdue
                    ? "text-red-600"
                    : "text-gray-900"
                }`}
              >
                {formattedDeadline}
              </p>

              {isOverdue && (
                <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                  Overdue
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Edit task form */}
      {isEditing && (
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Edit Task
          </h2>

          <EditTaskForm
            task={task}
            projects={projects}
            onUpdateTask={(data) =>
              updateTaskMutation.mutate(data)
            }
            isUpdating={updateTaskMutation.isPending}
            error={
              updateTaskMutation.error instanceof Error
                ? updateTaskMutation.error.message
                : updateTaskMutation.error
                  ? "Failed to update task."
                  : null
            }
          />

          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              updateTaskMutation.reset();
            }}
            className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
        </section>
      )}
    </main>
  );
}