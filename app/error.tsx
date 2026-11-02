"use client";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
      <p className="font-medium">Could not load tasks.</p>
      <p className="mt-1">
        {typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "Something went wrong."}
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-4 rounded-lg border border-red-300 px-3 py-1.5 font-medium transition-colors hover:bg-red-100 dark:border-red-900 dark:hover:bg-red-950"
      >
        Try again
      </button>
    </div>
  );
}
