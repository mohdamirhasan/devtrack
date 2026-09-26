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