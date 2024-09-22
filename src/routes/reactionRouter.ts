import { t } from '../trpc';
import db from '../db';
import { z } from 'zod';

export const reactionRouter = t.router({
  // Listagem de postagens com reações
  listPostsWithReactions: t.procedure
    .query(async () => {
      const posts = await db.selectFrom('posts')
        .leftJoin('reactions', 'posts.id', 'reactions.post_id')
        .select([
          'posts.*',
          db.raw('COUNT(reactions.id) AS reactions_count')
        ])
        .groupBy('posts.id')
        .execute();

      return posts;
    }),

  // Adicionar reação
  addReaction: t.procedure
    .input(
      z.object({
        postId: z.number(),
        userId: z.number(),
        type: z.enum(['like', 'dislike'])
      })
    )
    .mutation(async ({ input }) => {
      const { postId, userId, type } = input;

      await db.insertInto('reactions').values({
        post_id: postId,
        user_id: userId,
        type
      }).execute();

      return { success: true, message: 'Reaction added' };
    }),
});
