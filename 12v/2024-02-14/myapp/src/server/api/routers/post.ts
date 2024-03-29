import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { postInsertSchema, posts } from "@/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.number(), name: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello213123 ${input.text} ${input.name}`,
      };
    }),

  create: publicProcedure
    .input(postInsertSchema.pick({ name: true, description: true }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(posts).values(input);
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),
});
