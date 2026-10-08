import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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

function Tasks() {
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  const {
  data: projects = []
} = useQuery({
  queryKey: ["projects"],
  queryFn: getProjects,
});

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

  if (isPending) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Tasks
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your development tasks here.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">
            Loading tasks...
          </p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Tasks
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your development tasks here.
        </p>

        <div className="mt-8 rounded-xl border border-red-200 bg-white p-10 text-center">
          <h2 className="font-semibold text-gray-900">
            Unable to load tasks
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tasks
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your development tasks here.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="font-semibold text-gray-900">
            No tasks found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Create a task to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <article
              key={task.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {task.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {task.description}
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {task.priority}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {task.assignee}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {task.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      >
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