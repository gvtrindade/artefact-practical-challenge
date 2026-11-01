export type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
};

// In-memory store. Kept on `globalThis` so it survives hot reloads in development.
// Swap this for a database client when persistence is needed.
const globalForTasks = globalThis as unknown as {
  taskStore?: Map<string, Task>;
};

export const taskStore = globalForTasks.taskStore ?? new Map<string, Task>();

globalForTasks.taskStore = taskStore;
