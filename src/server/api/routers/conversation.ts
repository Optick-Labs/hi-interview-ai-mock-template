import { z } from "zod";
import { TRPCError } from "@trpc/server";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Define the MessageType enum to match Prisma schema
const MessageTypeEnum = z.enum(["QUESTION", "ANSWER"]);

export const conversationRouter = createTRPCRouter({
  // Get conversations by interview ID
  getByInterviewId: publicProcedure
    .input(
      z.object({
        interviewId: z.string(),
        limit: z.number().min(1).max(100).optional().default(100),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { interviewId, limit, cursor } = input;

        const conversations = await ctx.db.conversation.findMany({
          take: limit + 1,
          where: { interviewId },
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { timestamp: "asc" },
        });

        let nextCursor: string | undefined = undefined;
        if (conversations.length > limit) {
          const nextItem = conversations.pop();
          nextCursor = nextItem?.id;
        }

        return {
          items: conversations,
          nextCursor,
        };
      } catch (error) {
        console.error("Error fetching conversations:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch conversations",
        });
      }
    }),

  // Create a new conversation message
  create: publicProcedure
    .input(
      z.object({
        content: z.string().min(1, "Content is required"),
        type: MessageTypeEnum,
        interviewId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { content, type, interviewId, userId } = input;
        
        const conversation = await ctx.db.conversation.create({
          data: {
            content,
            type,
            interviewId,
            userId,
          },
        });
        return conversation;
      } catch (error) {
        console.error("Error creating conversation:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create conversation",
        });
      }
    }),

  // Generate an AI response
  generate: publicProcedure
    .input(
      z.object({
        interviewId: z.string(),
        userId: z.string(),
        previousMessages: z.array(
          z.object({
            content: z.string(),
            type: MessageTypeEnum,
          })
        ).optional(),
        prompt: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { interviewId, userId, previousMessages, prompt } = input;

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "OpenAI API key not configured",
        });
      }

      try {
        const openai = new OpenAI({ apiKey });

        // Fetch the interview to get context
        const interview = await ctx.db.interview.findUnique({
          where: { id: interviewId },
        });

        if (!interview) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Interview not found",
          });
        }

        // Build the messages for the AI
        const messages: ChatCompletionMessageParam[] = [
          {
            role: "system",
            content: 
              prompt ?? 
              `You are an interviewer conducting a behavioral interview for a job. Ask thoughtful questions about the candidate's past experiences and skills. Focus on behavioral questions that start with phrases like "Tell me about a time when..." or "Describe a situation where...". Be conversational, kind, but thorough in your follow-up questions.`,
          },
        ];

        // Add previous conversation context if provided
        if (previousMessages && previousMessages.length > 0) {
          previousMessages.forEach((msg) => {
            messages.push({
              role: msg.type === "ANSWER" ? "user" : "assistant",
              content: msg.content,
            });
          });
        }

        // Get AI response
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages,
        });

        const aiMessage = completion.choices[0]?.message?.content?.trim();

        if (!aiMessage) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate AI response",
          });
        }

        // Save the AI response to the database
        const conversation = await ctx.db.conversation.create({
          data: {
            content: aiMessage,
            type: "QUESTION",
            interviewId,
            userId,
          },
        });

        return conversation;
      } catch (error) {
        console.error("Error generating AI response:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate AI response",
        });
      }
    }),
}); 