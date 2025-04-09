import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Define the InterviewStatus enum to match Prisma schema
const InterviewStatusEnum = z.enum([
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const interviewRouter = createTRPCRouter({
  // Get all interviews
  getAll: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        status: InterviewStatusEnum.optional(),
        limit: z.number().min(1).max(100).optional().default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { limit, cursor, userId, status } = input;

        const interviews = await ctx.db.interview.findMany({
          take: limit + 1,
          where: {
            ...(userId ? { userId } : {}),
            ...(status ? { status } : {}),
          },
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { createdAt: "desc" },
          include: {
            _count: {
              select: { conversations: true },
            },
          },
        });

        let nextCursor: string | undefined = undefined;
        if (interviews.length > limit) {
          const nextItem = interviews.pop();
          nextCursor = nextItem?.id;
        }

        return {
          items: interviews,
          nextCursor,
        };
      } catch (error) {
        console.error("Error fetching interviews:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch interviews",
        });
      }
    }),

  // Get interview by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const interview = await ctx.db.interview.findUnique({
          where: { id: input.id },
          include: {
            evaluation: true,
            _count: {
              select: { conversations: true },
            },
          },
        });

        if (!interview) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Interview not found",
          });
        }

        return interview;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error("Error fetching interview:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch interview",
        });
      }
    }),

  // Create a new interview
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        userId: z.string(),
        status: InterviewStatusEnum.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { title, description, userId, status } = input;
        
        const interview = await ctx.db.interview.create({
          data: {
            title,
            description,
            userId,
            status: status ?? "IN_PROGRESS",
          },
        });
        return interview;
      } catch (error) {
        console.error("Error creating interview:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create interview",
        });
      }
    }),

  // Update an interview
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Title is required").optional(),
        description: z.string().optional(),
        status: InterviewStatusEnum.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;
        
        const interview = await ctx.db.interview.update({
          where: { id },
          data: updateData,
        });
        return interview;
      } catch (error) {
        console.error("Error updating interview:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update interview",
        });
      }
    }),

  // Delete an interview
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.interview.delete({
          where: { id: input.id },
        });
        return { success: true };
      } catch (error) {
        console.error("Error deleting interview:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete interview",
        });
      }
    }),
}); 