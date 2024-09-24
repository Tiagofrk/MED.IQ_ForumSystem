import { z } from 'zod';
import { t } from '../trpc';
import db from '../db';

export const reactionController = t.router({
  // Listar postagens com contagem de reações
  listPostsWithReactions: t.procedure.query(async () => {
    const posts = await db
      .selectFrom('posts')
      .leftJoin('reactions', 'posts.id', 'reactions.post_id')
      .select([
        'posts.id',
        'posts.title',
        'posts.content',
        'posts.user_id',
        'posts.created_at',
        db.fn.count('reactions.id').as('reactions_count'),
      ])
      .groupBy('posts.id')
      .execute();

    return posts;
  }),

  // Adicionar reação a uma postagem
  addReaction: t.procedure
    .input(
      z.object({
        postId: z.number(),
        userId: z.number(),
        type: z.enum(['like', 'dislike']),
      })
    )
    .mutation(async ({ input }) => {
      const { postId, userId, type } = input;

      try {
        // Verificar se o usuário já reagiu à postagem
        const existingReaction = await db
          .selectFrom('reactions')
          .select(['id'])
          .where('post_id', '=', postId)
          .where('user_id', '=', userId)
          .executeTakeFirst();

        if (existingReaction) {
          // Atualizar a reação existente
          await db
            .updateTable('reactions')
            .set({ type })
            .where('id', '=', existingReaction.id)
            .execute();

          return { success: true, message: 'Reação atualizada com sucesso.' };
        } else {
          // Inserir nova reação
          await db
            .insertInto('reactions')
            .values({
              post_id: postId,
              user_id: userId,
              type,
            })
            .execute();

          return { success: true, message: 'Reação adicionada com sucesso.' };
        }
      } catch (error) {
        throw new Error('Erro ao adicionar reação.');
      }
    }),
});
