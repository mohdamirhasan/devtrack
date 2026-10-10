import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewTaskForm from "@/components/NewTaskForm";
import { createTask, getTasks } from "@/api/tasks";
import { getProjects } from "@/api/projects";
import type { CreateTaskInput } from "@/types/task";
import { Link } from "react-router";

type StatusFilter = "All" | "Todo" | "In Progress" | "Completed";

type PriorityFilter = "All" | "Low" | "Medium" | "High";

type SortOption = "deadline-asc" | "deadline-desc" | "priority-desc";

function Tasks() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");

  const [sortBy, setSortBy] = useState<SortOption>("deadline-asc");

  const [searchQuery, setSearchQuery] = useState("");

  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      const matchesSearch =
        normalizedQuery === "" ||
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.description.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    const priorityRank = {
      High: 3,
      Medium: 2,
      Low: 1,
    };

    return [...filtered].sort((a, b) => {
      if (sortBy === "deadline-asc") {
        return a.deadline.localeCompare(b.deadline);
      }

      if (sortBy === "deadline-desc") {
        return b.deadline.localeCompare(a.deadline);
      }

      return priorityRank[b.priority] - priorityRank[a.priority];
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  const createTaskMutation = useMutation({
    mutationFn: createTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      setIsFormOpen(false);
    },
  });

  const handleCreateTask = (task: CreateTaskInput) => {
    createTaskMutation.mutate(task);
  };

  // Get today's date in YYYY-MM-DD format.
  const today = new Date();

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  // Format a date-only string without a timezone shift.
  const formatDeadline = (deadline: string) => {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(`${deadline}T00:00:00`));
  };

  if (isPending) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>

        <p className="mt-2 text-gray-500">
          Manage your development tasks here.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">Loading tasks...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>

        <p className="mt-2 text-gray-500">
          Manage your development tasks here.
        </p>

        <div className="mt-8 rounded-xl border border-red-200 bg-white p-10 text-center">
          <h2 className="font-semibold text-gray-900">Unable to load tasks</h2>

          <p className="mt-2 text-sm text-gray-500">{error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8 p-8">
      {/* Page heading */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>

          <p className="mt-2 text-gray-500">
            Manage your development tasks here.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
          + New Task
        </button>
      </div>

      {/* Task search */}
      <div>
        <label
          htmlFor="task-search"
          className="mb-2 block text-sm font-medium text-gray-700">
          Search tasks
        </label>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-gray-400"
            aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>

          <input
            id="task-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by task title or description..."
            className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Filters and sorting */}
      <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="status-filter"
            className="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500">
            <option value="All">All statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="priority-filter"
            className="mb-2 block text-sm font-medium text-gray-700">
            Priority
          </label>

          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value as PriorityFilter)
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500">
            <option value="All">All priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sort-by"
            className="mb-2 block text-sm font-medium text-gray-700">
            Sort by
          </label>

          <select
            id="sort-by"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500">
            <option value="deadline-asc">Earliest deadline</option>
            <option value="deadline-desc">Latest deadline</option>
            <option value="priority-desc">Priority: High to Low</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("All");
              setPriorityFilter("All");
              setSortBy("deadline-asc");
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            Reset filters
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </p>
      {/* Empty state */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="font-semibold text-gray-900">
            {tasks.length === 0 ? "No tasks found" : "No matching tasks"}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {tasks.length === 0
              ? "Create a task to get started."
              : "Try changing your filters to see more tasks."}
          </p>
        </div>
      ) : (
        /* Task cards */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => {
            const isOverdue =
              task.status !== "Completed" && task.deadline < todayString;

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
              <Link
                key={task.id}
                to={`/tasks/${task.id}`}
                className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-400 hover:shadow-md">
                <article>
                  {/* Task title and priority */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="break-words font-semibold text-gray-900">
                        {task.title}
                      </h2>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                        {task.description}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        priorityClasses[task.priority] ??
                        "bg-gray-100 text-gray-700"
                      }`}>
                      {task.priority}
                    </span>
                  </div>

                  {/* Deadline */}
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Deadline
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          isOverdue ? "text-red-600" : "text-gray-700"
                        }`}>
                        {formatDeadline(task.deadline)}
                      </span>

                      {isOverdue && (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Assignee and status */}
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="truncate text-sm text-gray-500">
                      {task.assignee}
                    </span>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        statusClasses[task.status] ??
                        "bg-gray-100 text-gray-700"
                      }`}>
                      {task.status}
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}

      {/* New task dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>

            <DialogDescription>
              Create a new task for your development team.
            </DialogDescription>
          </DialogHeader>

          <NewTaskForm
            projects={projects}
            onCreateTask={handleCreateTask}
            isCreating={createTaskMutation.isPending}
            error={
              createTaskMutation.isError
                ? createTaskMutation.error.message
                : null
            }
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default Tasks;
