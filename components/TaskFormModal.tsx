"use client";

import { useState } from "react";
import Modal from "./Modal";
import { Task } from "@/trpc/task-store";

export type TaskFormValues = {
  title: string;
  description: string;
};

export default function TaskFormModal({
  task,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  task?: Task;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
}) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(task);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (trimmedTitle.length > 200) {
      setError("Title must be 200 characters or fewer.");
      return;
    }

    if (trimmedDescription.length > 2000) {
      setError("Description must be 2000 characters or fewer.");
      return;
    }

    setError(null);
    onSubmit({ title: trimmedTitle, description: trimmedDescription });
  }

  return (
    <Modal
      titleId="task-form-title"
      closeDisabled={isSubmitting}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <h2
          id="task-form-title"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
        >
          {isEditing ? "Edit task" : "New task"}
        </h2>

        <div className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Title
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={200}
              autoFocus
              required
              placeholder="What needs to be done?"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-normal text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="Add more details (optional)"
              className="resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-normal text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400"
            />
          </label>

          {error ? (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Create task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
