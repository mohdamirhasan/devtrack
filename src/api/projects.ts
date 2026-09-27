import type {
  CreateProjectInput,
  Project,
} from "@/types/project";

const API_URL = "http://localhost:3000";

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_URL}/projects`);

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

export async function getProject(id: string): Promise<Project> {
  const response = await fetch(`${API_URL}/projects/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Project not found");
    }

    throw new Error("Failed to fetch project");
  }

  return response.json();
}

export async function createProject(
  input: CreateProjectInput,
): Promise<Project> {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
}

export async function updateProject(
  id: string,
  input: Partial<CreateProjectInput> & {
    progress?: number;
    members?: number;
  },
): Promise<Project> {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Project not found");
    }

    throw new Error("Failed to update project");
  }

  return response.json();
}