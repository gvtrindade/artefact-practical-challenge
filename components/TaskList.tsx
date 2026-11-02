import TaskListItem from "./TaskListItem";
import { Task } from "@/trpc/task-store";

export default function TaskList({
  tasks,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-950">
        <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
          No tasks yet
        </p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Tasks you create will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskListItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
