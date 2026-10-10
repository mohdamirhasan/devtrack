export type TaskStatus =
  | "Todo"
  | "In Progress"
  | "Completed";

export type TaskPriority =
  | "Low"
  | "Medium"
  | "High";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assignee: string;
  deadline: string;
};