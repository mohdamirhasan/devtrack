import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { getProject } from "@/api/projects";

function ProjectDetails() {
  const { projectId } = useParams();

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

  if (isPending) {
    return (
      <div className="p-8">
        <p className="text-sm text-gray-500">Loading project...</p>
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

      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          {project.name}
        </h2>

        <p className="mt-2 text-gray-500">
          {project.description}
        </p>
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
    </div>
  );
}

export default ProjectDetails;