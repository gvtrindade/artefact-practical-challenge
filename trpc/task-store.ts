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

// Seed the empty in-memory store so the app has data to display on startup.
if (taskStore.size === 0) {
  const now = Date.now();

  for (let index = 1; index <= 200; index++) {
    const task: Task = {
      id: crypto.randomUUID(),
      title: `Task ${index}`,
      ...(index % 3 === 0
        ? { description: `Description for task ${index}.` }
        : {}),
      createdAt: new Date(now - index * 60_000).toISOString(),
    };

    taskStore.set(task.id, task);
  }
}
