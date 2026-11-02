"use client";

import { Task } from "@/trpc/task-store";

export default function TaskActions({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => onEdit(task)}
        aria-label={`Edit task "${task.title}"`}
        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:focus-visible:outline-zinc-300"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(task)}
        aria-label={`Delete task "${task.title}"`}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
      >
        Delete
      </button>
    </div>
  );
}
