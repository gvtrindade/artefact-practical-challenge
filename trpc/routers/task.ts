import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { taskStore, type Task } from "@/trpc/task-store";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";

const idSchema = z
  .string({ error: "Task id is required" })
  .min(1, "Task id is required");

const titleSchema = z
  .string({ error: "Title is required" })
  .trim()
  .min(1, "Title is required")
  .max(200, "Title must be 200 characters or fewer");

const descriptionSchema = z
  .string()
  .trim()
  .max(2000, "Description must be 2000 characters or fewer");

const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema.optional(),
});

const updateTaskSchema = z
  .object({
    id: idSchema,
    title: titleSchema.optional(),
    description: descriptionSchema.nullable().optional(),
  })
  .refine(
    (data) => data.title !== undefined || data.description !== undefined,
    {
      message: "Provide at least one field to update (title or description)",
    },
  );

const deleteTaskSchema = z.object({
  id: idSchema,
});

const taskByIdSchema = z.object({
  id: idSchema,
});

function getTaskOrThrow(id: string): Task {
  const task = taskStore.get(id);

  if (!task) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Task with id "${id}" was not found.`,
    });
  }

  return task;
}

export const taskRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return Array.from(taskStore.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }),

  byId: publicProcedure.input(taskByIdSchema).query(({ input }) => {
    return getTaskOrThrow(input.id);
  }),

  create: publicProcedure.input(createTaskSchema).mutation(({ input }) => {
    const description = input.description?.length
      ? input.description
      : undefined;

    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      ...(description ? { description } : {}),
      createdAt: new Date().toISOString(),
    };

    taskStore.set(task.id, task);

    return task;
  }),

  update: publicProcedure.input(updateTaskSchema).mutation(({ input }) => {
    const existing = getTaskOrThrow(input.id);

    const updated: Task = {
      ...existing,
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined
        ? input.description === null || input.description.length === 0
          ? { description: undefined }
          : { description: input.description }
        : {}),
    };

    if (updated.description === undefined) {
      delete updated.description;
    }

    taskStore.set(updated.id, updated);

    return updated;
  }),

  delete: publicProcedure.input(deleteTaskSchema).mutation(({ input }) => {
    const existing = getTaskOrThrow(input.id);

    taskStore.delete(input.id);

    return existing;
  }),
});
