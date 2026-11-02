"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useTRPC } from "@/trpc/client";
import TaskListSkeleton from "@/components/TaskListSkeleton";
import TaskFormModal, { TaskFormValues } from "@/components/TaskFormModal";
import { Task } from "@/trpc/task-store";
import DeleteTaskModal from "@/components/DeleteTaskModal";
import TaskList from "@/components/TaskList";
import NewTaskButton from "@/components/NewTaskButton";
import Toast, { ToastType } from "@/components/Toast";

type FormModalState = { mode: "create" } | { mode: "edit"; task: Task };

export default function HomeClient() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const tasksQuery = useQuery(trpc.task.list.queryOptions());
  const [taskToDelete, setTaskToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [formModal, setFormModal] = useState<FormModalState | null>(null);
  const [toast, setToast] = useState<ToastType | null>(null);

  function showToast(type: ToastType["type"], message: string) {
    setToast({ type, message });
  }

  async function refreshTasks() {
    await queryClient.invalidateQueries({
      queryKey: trpc.task.list.queryKey(),
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

  const tasks = tasksQuery.data ?? [];
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
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Tasks
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {tasks.length > 0
              ? `${tasks.length} task${tasks.length === 1 ? "" : "s"} in your list.`
              : "View and manage your tasks."}
          </p>
        </div>
        <NewTaskButton onClick={() => setFormModal({ mode: "create" })} />
      </header>

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
    </>
  );
}
