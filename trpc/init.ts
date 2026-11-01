import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

export async function createTRPCContext(opts: { headers: Headers }) {
  return {};
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    if (error.cause instanceof ZodError) {
      return {
        ...shape,
        message: error.cause.issues.map((issue) => issue.message).join(" "),
      };
    }

    return shape;
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
