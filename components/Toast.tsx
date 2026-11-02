"use client";

import { useEffect } from "react";

export type ToastType = {
  type: "success" | "error";
  message: string;
};

export default function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastType;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timeout = window.setTimeout(onDismiss, 4000);
    return () => window.clearTimeout(timeout);
  }, [onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 w-full max-w-sm"
    >
      <div
        className={`flex items-start justify-between gap-4 rounded-xl border p-4 shadow-lg ${
          toast.type === "success"
            ? "border-green-200 bg-white text-green-800 dark:border-green-900/60 dark:bg-zinc-950 dark:text-green-300"
            : "border-red-200 bg-white text-red-800 dark:border-red-900/60 dark:bg-zinc-950 dark:text-red-300"
        }`}
      >
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 rounded text-current opacity-70 transition-opacity hover:opacity-100"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
