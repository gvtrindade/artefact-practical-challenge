"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import DeleteTaskModal from "@/components/DeleteTaskModal";
import NewTaskButton from "@/components/NewTaskButton";
import TaskFormModal, { TaskFormValues } from "@/components/TaskFormModal";
import TaskList from "@/components/TaskList";
import TaskListSkeleton from "@/components/TaskListSkeleton";
import Toast, { ToastType } from "@/components/Toast";
import { useTRPC } from "@/trpc/client";
import { Task } from "@/trpc/task-store";
import { TASK_PAGE_SIZE } from "@/trpc/task-properties";

type FormModalState = { mode: "create" } | { mode: "edit"; task: Task };

export default function HomeClient() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const tasksQuery = useInfiniteQuery(
    trpc.task.list.infiniteQueryOptions(
      { limit: TASK_PAGE_SIZE },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      },
    ),
  );
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = tasksQuery;
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [taskToDelete, setTaskToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [formModal, setFormModal] = useState<FormModalState | null>(null);
  const [toast, setToast] = useState<ToastType | null>(null);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  function showToast(type: ToastType["type"], message: string) {
    setToast({ type, message });
  }

  async function refreshTasks() {
    await queryClient.invalidateQueries({
      queryKey: trpc.task.list.pathKey(),
    });
  }

  const createMutation = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: async () => {
        setFormModal(null);
        showToast("success", "Task created successfully.");
        await refreshTasks();
      },
      onError: (error) => {
        showToast("error", error.message || "Failed to create the task.");
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.task.update.mutationOptions({
      onSuccess: async () => {
        setFormModal(null);
        showToast("success", "Task updated successfully.");
        await refreshTasks();
      },
      onError: (error) => {
        showToast("error", error.message || "Failed to update the task.");
      },
    }),
  );

  const deleteMutation = useMutation(
    trpc.task.delete.mutationOptions({
      onSuccess: async () => {
        setTaskToDelete(null);
        showToast("success", "Task deleted successfully.");
        await refreshTasks();
      },
      onError: (error) => {
        showToast("error", error.message || "Failed to delete the task.");
      },
    }),
  );

  const tasks =
    tasksQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = tasksQuery.data?.pages[0]?.totalCount ?? 0;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  function handleFormSubmit(values: TaskFormValues) {
    if (formModal?.mode === "edit") {
      updateMutation.mutate({
        id: formModal.task.id,
        title: values.title,
        description: values.description,
      });
    } else {
      createMutation.mutate({
        title: values.title,
        description: values.description,
      });
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="mb-8 flex shrink-0 flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Tasks
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {totalCount > 0
              ? `${totalCount} task${totalCount === 1 ? "" : "s"} in your list.`
              : "View and manage your tasks."}
          </p>
        </div>
        <NewTaskButton onClick={() => setFormModal({ mode: "create" })} />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {tasksQuery.isPending ? (
          <TaskListSkeleton />
        ) : tasksQuery.isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            <p className="font-medium">Could not load tasks.</p>
            <p className="mt-1">{tasksQuery.error.message}</p>
            <button
              type="button"
              onClick={() => tasksQuery.refetch()}
              className="mt-4 rounded-lg border border-red-300 px-3 py-1.5 font-medium transition-colors hover:bg-red-100 dark:border-red-900 dark:hover:bg-red-950"
            >
              Try again
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-950">
            <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
              No tasks yet
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Tasks you create will appear here.
            </p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={(task) => setFormModal({ mode: "edit", task })}
            onDelete={(task) =>
              setTaskToDelete({ id: task.id, title: task.title })
            }
          />
        )}

        {tasks.length > 0 ? (
          <div
            ref={loadMoreRef}
            className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
          >
            {isFetchingNextPage
              ? "Loading more tasks..."
              : hasNextPage
                ? "Scroll to load more"
                : "All tasks loaded."}
          </div>
        ) : null}
      </div>

      {formModal ? (
        <TaskFormModal
          key={formModal.mode === "edit" ? formModal.task.id : "create"}
          task={formModal.mode === "edit" ? formModal.task : undefined}
          isSubmitting={isSaving}
          onClose={() => {
            if (!isSaving) setFormModal(null);
          }}
          onSubmit={handleFormSubmit}
        />
      ) : null}

      {taskToDelete ? (
        <DeleteTaskModal
          taskTitle={taskToDelete.title}
          isDeleting={deleteMutation.isPending}
          onClose={() => setTaskToDelete(null)}
          onConfirm={() => deleteMutation.mutate({ id: taskToDelete.id })}
        />
      ) : null}

      {toast ? <Toast toast={toast} onDismiss={() => setToast(null)} /> : null}
    </div>
  );
}
