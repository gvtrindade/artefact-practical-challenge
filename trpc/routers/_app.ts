import { createTRPCRouter } from "@/trpc/init";

import { taskRouter } from "./task";

export const appRouter = createTRPCRouter({
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
