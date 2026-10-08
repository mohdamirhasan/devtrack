import type {
  CreateTaskInput,
  Task,
} from "@/types/task";

const API_URL = "http://localhost:3000";

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

export async function getTask(
  id: string,
): Promise<Task> {
  const response = await fetch(
    `${API_URL}/tasks/${id}`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Task not found");
    }

    throw new Error("Failed to fetch task");
  }

  return response.json();
}

export async function createTask(
  input: CreateTaskInput,
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    if (response.status === 400) {
      throw new Error(
        errorData?.error ??
          "Task creation validation failed",
      );
    }

    throw new Error(
      errorData?.error ??
        `Failed to create task (${response.status})`,
    );
  }

  return response.json();
}

export async function updateTask(
  id: string,
  input: Partial<CreateTaskInput>,
): Promise<Task> {
  const response = await fetch(
    `${API_URL}/tasks/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    if (response.status === 404) {
      throw new Error("Task not found");
    }

    if (response.status === 400) {
      throw new Error(
        errorData?.error ??
          "Task update validation failed",
      );
    }

    throw new Error(
      errorData?.error ??
        `Failed to update task (${response.status})`,
    );
  }

  return response.json();
}

export async function deleteTask(
  id: string,
): Promise<Task> {
  const response = await fetch(
    `${API_URL}/tasks/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    if (response.status === 404) {
      throw new Error("Task not found");
    }

    throw new Error(
      errorData?.error ??
        `Failed to delete task (${response.status})`,
    );
  }

  return response.json();
}