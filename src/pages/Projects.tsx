import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProjectCard from "@/components/ProjectCard";
import NewProjectForm from "@/components/NewProjectForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createProject, getProjects } from "@/api/projects";
import type { CreateProjectInput, Project } from "@/types/project";

function Projects() {
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
  mutationFn: createProject,

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["projects"],
    });

    setIsFormOpen(false);
  },
});

  const handleCreateProject = (project: CreateProjectInput) => {
    createProjectMutation.mutate(project);
  };
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Project["status"] | "All">(
    "All",
  );

  const {
    data: projects = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !query ||
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Projects</h2>

          <p className="mt-2 text-gray-500">
            Manage and track your team's projects.
          </p>
        </div>

        <Button onClick={() => setIsFormOpen(true)}>+ New Project</Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="max-w-md flex-1">
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>

          <input
            id="project-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label htmlFor="status-filter" className="sr-only">
            Filter by status
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as Project["status"] | "All")
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-gray-900 sm:w-48">
            <option value="All">All statuses</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {isPending ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">Loading projects...</p>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-white p-10 text-center">
          <h3 className="font-semibold text-gray-900">Something went wrong</h3>

          <p className="mt-1 text-sm text-gray-500">Unable to load projects.</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h3 className="font-semibold text-gray-900">No projects found</h3>

          <p className="mt-1 text-sm text-gray-500">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>

            <DialogDescription>
              Create a new project for your team.
            </DialogDescription>
          </DialogHeader>
          <NewProjectForm
  onCreateProject={handleCreateProject}
  isCreating={createProjectMutation.isPending}
  error={
    createProjectMutation.isError
      ? "Unable to create project."
      : null
  }
/>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Projects;
