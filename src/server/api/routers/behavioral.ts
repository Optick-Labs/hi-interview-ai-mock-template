import { z } from "zod";
import { TRPCError } from "@trpc/server";
import OpenAI from "openai";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const behavioralRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  createDummy: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.dummy.create({
        data: {
          name: input.name,
        },
      });
    }),

  getLatestDummy: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.dummy.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return post ?? null;
  }),

  aiTest: publicProcedure
    .input(z.object({ country: z.string() }))
    .mutation(async ({ input }) => {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "OpenAI API key not configured",
        });
      }

      try {
        const openai = new OpenAI({ apiKey });

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: `What is the capital of ${input.country}?` }],
        });

        const aiMessage = completion.choices[0]?.message?.content?.trim();

        if (!aiMessage) {
          console.error("Invalid OpenAI response structure:", completion);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to parse AI response.",
          });
        }

        return {
          result: aiMessage,
        };
      } catch (error) {
        console.error("Error in aiTest:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error in aiTest",
        });
      }
    }),
});
