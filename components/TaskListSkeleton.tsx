export default function TaskListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading tasks">
      <span className="sr-only">Loading tasks...</span>
      <ul className="flex flex-col gap-3">
        {[0, 1, 2].map((index) => (
          <li
            key={index}
            className="flex items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="w-full">
              <div className="h-4 w-2/5 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-3 h-3 w-4/5 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-2 h-3 w-3/5 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="h-8 w-20 shrink-0 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          </li>
        ))}
      </ul>
    </div>
  );
}
