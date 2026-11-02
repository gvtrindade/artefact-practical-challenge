"use client";

import Modal from "./Modal";

export default function DeleteTaskModal({
  taskTitle,
  isDeleting,
  onClose,
  onConfirm,
}: {
  taskTitle: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      titleId="delete-dialog-title"
      descriptionId="delete-dialog-description"
      closeDisabled={isDeleting}
      onClose={onClose}
    >
      <h2
        id="delete-dialog-title"
        className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
      >
        Delete task?
      </h2>
      <p
        id="delete-dialog-description"
        className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400"
      >
        This will permanently delete{" "}
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          &ldquo;{taskTitle}&rdquo;
        </span>
        . This action cannot be undone.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
