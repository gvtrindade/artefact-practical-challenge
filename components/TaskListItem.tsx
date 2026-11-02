import TaskActions from "./TaskActions";
import { Task } from "@/trpc/task-store";

export default function TaskListItem({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  return (
    <li className="flex items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="min-w-0">
        <h2 className="wrap-break-word text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {task.title}
        </h2>
        {task.description ? (
          <p className="mt-1 whitespace-pre-line text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {task.description}
          </p>
        ) : null}
      </div>
      <TaskActions task={task} onEdit={onEdit} onDelete={onDelete} />
    </li>
  );
}
