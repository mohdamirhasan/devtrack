import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import EditProjectForm from "@/components/EditProjectForm";
import { updateProject, getProject } from "@/api/projects";

function ProjectDetails() {
  const { projectId } = useParams();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    data: project,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId!),
    enabled: Boolean(projectId),
  });

  const updateProjectMutation = useMutation({
    mutationFn: (data: {
      name: string;
      description: string;
      status: "Planning" | "In Progress" | "Completed";
      progress: number;
      members: number;
    }) => updateProject(projectId!, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });

      setIsEditOpen(false);
    },
  });

  if (isPending) {
    return (
      <div className="p-8">
        <p className="text-sm text-gray-500">
          Loading project...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Unable to load project
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {error.message}
        </p>

        <Link
          to="/projects"
          className="mt-4 inline-flex text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <Link
        to="/projects"
        className="inline-flex text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        ← Back to Projects
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {project.name}
          </h2>

          <p className="mt-2 text-gray-500">
            {project.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Edit Project
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Status</p>

          <p className="mt-2 font-semibold text-gray-900">
            {project.status}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Progress</p>

          <p className="mt-2 font-semibold text-gray-900">
            {project.progress}%
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Members</p>

          <p className="mt-2 font-semibold text-gray-900">
            {project.members}
          </p>
        </div>
      </div>

      {isEditOpen && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Edit Project
            </h3>

            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>

          <EditProjectForm
            project={project}
            onUpdateProject={(data) =>
              updateProjectMutation.mutate(data)
            }
            isUpdating={updateProjectMutation.isPending}
            error={
  updateProjectMutation.isError
    ? updateProjectMutation.error.message
    : null
}
          />
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;