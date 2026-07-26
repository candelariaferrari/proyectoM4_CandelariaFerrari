export type TaskPriority = "high" | "medium" | "low";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
