import { t } from '../trpc';
import db from '../db';
import { z } from 'zod';

export const adminRouter = t.router({
  // Excluir postagem (apenas moderadores)
  deletePost: t.procedure
    .input(
      z.object({
        postId: z.number(),
        moderatorId: z.number() // ID do moderador
      })
    )
    .mutation(async ({ input }) => {
      const { postId, moderatorId } = input;

      // Verificar se é moderador
      const moderator = await db.selectFrom('users')
        .select('role')
        .where('id', '=', moderatorId)
        .executeTakeFirst();

      if (moderator?.role !== 'moderator') {
        throw new Error('Only moderators can delete posts');
      }

      await db.deleteFrom('posts').where('id', '=', postId).execute();

      return { success: true, message: 'Post deleted' };
    }),

  // Bloquear usuário
  blockUser: t.procedure
    .input(
      z.object({
        userId: z.number(),
        moderatorId: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { userId, moderatorId } = input;

      // Verificar se é moderador
      const moderator = await db.selectFrom('users')
        .select('role')
        .where('id', '=', moderatorId)
        .executeTakeFirst();

      if (moderator?.role !== 'moderator') {
        throw new Error('Only moderators can block users');
      }

      await db.updateTable('users')
        .set({ blocked: true })
        .where('id', '=', userId)
        .execute();

      return { success: true, message: 'User blocked' };
    }),
});
