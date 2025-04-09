import { z } from "zod";
import { TRPCError } from "@trpc/server";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const evaluationRouter = createTRPCRouter({
  // Get evaluations by user ID
  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const evaluations = await ctx.db.evaluation.findMany({
          where: { userId: input.userId },
          include: {
            interview: true,
          },
          orderBy: { createdAt: "desc" },
        });
        return evaluations;
      } catch (error) {
        console.error("Error fetching evaluations:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch evaluations",
        });
      }
    }),

  // Get evaluation by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const evaluation = await ctx.db.evaluation.findUnique({
          where: { id: input.id },
          include: {
            interview: true,
          },
        });

        if (!evaluation) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Evaluation not found",
          });
        }

        return evaluation;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error("Error fetching evaluation:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch evaluation",
        });
      }
    }),

  // Create an evaluation
  create: publicProcedure
    .input(
      z.object({
        score: z.number().min(1).max(10),
        feedback: z.string(),
        interviewId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { score, feedback, interviewId, userId } = input;
        
        // Check if interview exists
        const interview = await ctx.db.interview.findUnique({
          where: { id: interviewId },
          include: { evaluation: true },
        });

        if (!interview) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Interview not found",
          });
        }

        // Check if evaluation already exists
        if (interview.evaluation) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Evaluation already exists for this interview",
          });
        }

        // Create the evaluation
        const evaluation = await ctx.db.evaluation.create({
          data: {
            score,
            feedback,
            interviewId,
            userId,
          },
        });

        // Update interview status to COMPLETED
        await ctx.db.interview.update({
          where: { id: interviewId },
          data: { 
            status: "COMPLETED",
          },
        });

        return evaluation;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error("Error creating evaluation:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create evaluation",
        });
      }
    }),

  // Generate AI evaluation
  generateEvaluation: publicProcedure
    .input(
      z.object({
        interviewId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { interviewId, userId } = input;

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "OpenAI API key not configured",
        });
      }

      try {
        // Check if interview exists
        const interview = await ctx.db.interview.findUnique({
          where: { id: interviewId },
          include: { evaluation: true },
        });

        if (!interview) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Interview not found",
          });
        }

        // Check if evaluation already exists
        if (interview.evaluation) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Evaluation already exists for this interview",
          });
        }

        // Get all conversation messages for this interview
        const conversations = await ctx.db.conversation.findMany({
          where: { interviewId },
          orderBy: { timestamp: "asc" },
        });

        if (conversations.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No conversations found for this interview",
          });
        }

        const openai = new OpenAI({ apiKey });

        // Format conversation for AI
        const formattedConversation: ChatCompletionMessageParam[] = conversations.map((msg) => ({
          role: msg.type === "QUESTION" ? "assistant" : "user",
          content: msg.content,
        }));

        // Request AI evaluation
        const messages: ChatCompletionMessageParam[] = [
          {
            role: "system",
            content: "You are an expert at evaluating behavioral interviews. Analyze the interview and provide a score from 1-10 and detailed feedback on the candidate's responses. Focus on communication skills, relevance of examples, and how well they demonstrated their capabilities.",
          },
          ...formattedConversation,
          {
            role: "user",
            content: "Please evaluate this interview. Provide a score from 1-10 and detailed feedback. Format your response exactly like this: [SCORE: X] followed by your detailed feedback.",
          },
        ];

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages,
        });

        const aiResponse = completion.choices[0]?.message?.content?.trim() ?? "";

        // Extract score from response
        const scoreRegex = /\[SCORE:\s*(\d+)]/i;
        const scoreMatch = scoreRegex.exec(aiResponse);
        const score = scoreMatch ? parseInt(scoreMatch[1] ?? "5", 10) : 5;
        
        // Clean feedback text
        const feedback = aiResponse.replace(/\[SCORE:\s*\d+]/i, "").trim();
        
        // Ensure score is within range
        const validScore = Math.min(Math.max(score, 1), 10);

        // Create evaluation
        const evaluation = await ctx.db.evaluation.create({
          data: {
            score: validScore,
            feedback,
            interviewId,
            userId,
          },
        });

        // Update interview status
        await ctx.db.interview.update({
          where: { id: interviewId },
          data: { 
            status: "COMPLETED",
          },
        });

        return evaluation;
      } catch (error) {
        console.error("Error generating AI evaluation:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate AI evaluation",
        });
      }
    }),
}); 