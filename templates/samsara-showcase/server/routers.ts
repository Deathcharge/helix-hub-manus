import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { 
  createFractal, 
  getUserFractals, 
  getFractal, 
  updateFractal, 
  toggleFractalFavorite, 
  deleteFractal,
  createCollection,
  getUserCollections,
  getUserStats
} from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,

  portals: router({
    // Generate a single portal (admin only)
    generate: protectedProcedure
      .input(z.object({
        portalType: z.enum(["core", "agents", "consciousness", "system", "all"]),
        portalName: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if user is admin
        if (ctx.user.email !== "ward.andrew32@gmail.com") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only administrators can generate portals",
          });
        }

        const { portalType, portalName } = input;
        console.log(`[Portal Generator] Generating ${portalType} portal: ${portalName}`);
        console.log(`[Portal Generator] Requested by: ${ctx.user.email}`);

        const portalId = `${portalType}-${Date.now()}`;
        const deploymentUrl = `https://${portalName.toLowerCase().replace(/\s+/g, "-")}.manus.space`;

        return {
          success: true,
          portalId,
          portalName,
          portalType,
          deploymentUrl,
          status: "generating",
          message: `Portal generation initiated for ${portalName}`,
          timestamp: new Date().toISOString(),
        };
      }),

    // Generate all 51 portals (admin only)
    generateAll: protectedProcedure
      .mutation(async ({ ctx }) => {
        // Check if user is admin
        if (ctx.user.email !== "ward.andrew32@gmail.com") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only administrators can generate portals",
          });
        }

        console.log(`[Portal Generator] Generating all 51 portals`);
        console.log(`[Portal Generator] Requested by: ${ctx.user.email}`);

        return {
          success: true,
          message: "Generating all 51 portals. This may take several minutes.",
          totalPortals: 51,
          status: "generating",
          timestamp: new Date().toISOString(),
        };
      }),
  }),

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  fractals: router({
    // Create a new fractal
    create: protectedProcedure
      .input(z.object({
        imageUrl: z.string(),
        harmony: z.string(),
        zoom: z.string(),
        resilience: z.string(),
        prana: z.string(),
        drishti: z.string(),
        klesha: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const fractalId = `fractal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await createFractal({
            id: fractalId,
            userId: ctx.user.id,
            imageUrl: input.imageUrl,
            harmony: input.harmony,
            zoom: input.zoom,
            resilience: input.resilience,
            prana: input.prana,
            drishti: input.drishti,
            klesha: input.klesha,
            title: input.title,
            description: input.description,
            isFavorite: false,
            isPublic: false,
          });
          return { id: fractalId, success: true };
        } catch (error) {
          console.error("Failed to create fractal:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create fractal",
          });
        }
      }),

    // Get user's fractals
    list: protectedProcedure
      .input(z.object({
        limit: z.number().default(50),
      }))
      .query(async ({ ctx, input }) => {
        try {
          return await getUserFractals(ctx.user.id, input.limit);
        } catch (error) {
          console.error("Failed to get fractals:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get fractals",
          });
        }
      }),

    // Get a single fractal
    get: protectedProcedure
      .input(z.object({
        id: z.string(),
      }))
      .query(async ({ ctx, input }) => {
        try {
          const fractal = await getFractal(input.id);
          if (!fractal) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Fractal not found",
            });
          }
          // Check ownership
          if (fractal.userId !== ctx.user.id && !fractal.isPublic) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You do not have access to this fractal",
            });
          }
          return fractal;
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          console.error("Failed to get fractal:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get fractal",
          });
        }
      }),

    // Update fractal metadata
    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        isPublic: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const fractal = await getFractal(input.id);
          if (!fractal) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Fractal not found",
            });
          }
          if (fractal.userId !== ctx.user.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You do not have permission to update this fractal",
            });
          }
          
          await updateFractal(input.id, {
            title: input.title,
            description: input.description,
            isPublic: input.isPublic,
          });
          return { success: true };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          console.error("Failed to update fractal:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update fractal",
          });
        }
      }),

    // Toggle favorite status
    toggleFavorite: protectedProcedure
      .input(z.object({
        id: z.string(),
        isFavorite: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const fractal = await getFractal(input.id);
          if (!fractal) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Fractal not found",
            });
          }
          if (fractal.userId !== ctx.user.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You do not have permission to modify this fractal",
            });
          }
          
          await toggleFractalFavorite(input.id, input.isFavorite, ctx.user.id);
          return { success: true };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          console.error("Failed to toggle favorite:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to toggle favorite",
          });
        }
      }),

    // Delete fractal
    delete: protectedProcedure
      .input(z.object({
        id: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const fractal = await getFractal(input.id);
          if (!fractal) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Fractal not found",
            });
          }
          if (fractal.userId !== ctx.user.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You do not have permission to delete this fractal",
            });
          }
          
          await deleteFractal(input.id);
          return { success: true };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          console.error("Failed to delete fractal:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete fractal",
          });
        }
      }),
  }),

  collections: router({
    // Create a new collection
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        isPublic: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const collectionId = `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await createCollection({
            id: collectionId,
            userId: ctx.user.id,
            name: input.name,
            description: input.description,
            isPublic: input.isPublic,
          });
          return { id: collectionId, success: true };
        } catch (error) {
          console.error("Failed to create collection:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create collection",
          });
        }
      }),

    // Get user's collections
    list: protectedProcedure
      .query(async ({ ctx }) => {
        try {
          return await getUserCollections(ctx.user.id);
        } catch (error) {
          console.error("Failed to get collections:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get collections",
          });
        }
      }),
  }),

  user: router({
    // Get user stats
    stats: protectedProcedure
      .query(async ({ ctx }) => {
        try {
          const stats = await getUserStats(ctx.user.id);
          return stats || {
            userId: ctx.user.id,
            totalFractalsGenerated: 0,
            totalFavorites: 0,
            totalCollections: 0,
            lastGeneratedAt: null,
          };
        } catch (error) {
          console.error("Failed to get user stats:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get user stats",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

