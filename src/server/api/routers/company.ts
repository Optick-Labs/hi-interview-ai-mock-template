import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const companyRouter = createTRPCRouter({
  // Get all companies
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const companies = await ctx.db.company.findMany({
        orderBy: { name: "asc" },
      });
      return companies;
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch companies",
      });
    }
  }),

  // Get company by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const company = await ctx.db.company.findUnique({
          where: { id: input.id },
          include: { users: true },
        });

        if (!company) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Company not found",
          });
        }

        return company;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error("Error fetching company:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch company",
        });
      }
    }),

  // Create a new company
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Company name is required"),
        logo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const company = await ctx.db.company.create({
          data: {
            name: input.name,
            logo: input.logo,
          },
        });
        return company;
      } catch (error) {
        console.error("Error creating company:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create company",
        });
      }
    }),

  // Update a company
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Company name is required").optional(),
        logo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...data } = input;
        const company = await ctx.db.company.update({
          where: { id },
          data,
        });
        return company;
      } catch (error) {
        console.error("Error updating company:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update company",
        });
      }
    }),

  // Delete a company
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.company.delete({
          where: { id: input.id },
        });
        return { success: true };
      } catch (error) {
        console.error("Error deleting company:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete company",
        });
      }
    }),
}); 