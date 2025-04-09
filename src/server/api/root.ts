import { behavioralRouter } from "~/server/api/routers/behavioral";
import { companyRouter } from "~/server/api/routers/company";
import { interviewRouter } from "~/server/api/routers/interview";
import { conversationRouter } from "~/server/api/routers/conversation";
import { evaluationRouter } from "~/server/api/routers/evaluation";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  behavioral: behavioralRouter,
  companies: companyRouter,
  interviews: interviewRouter,
  conversations: conversationRouter,
  evaluations: evaluationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
