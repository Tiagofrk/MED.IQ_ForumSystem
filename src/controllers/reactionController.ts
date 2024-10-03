import { z } from 'zod';
import { t } from '../trpc/server';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

export const reactionController = t.router({
  // Listar postagens com reações
  listPostsWithReactions: t.procedure.query(async () => {
    try {
      const postsWithReactions = await db
        .selectFrom('posts')
        .innerJoin('reactions', 'reactions.post_id', 'posts.id') // Junta com a tabela de reações
        .innerJoin('users', 'users.id', 'posts.user_id') // Junta com a tabela de usuários para obter informações do autor
        .select(['posts.id', 'posts.title', 'posts.content', 'posts.created_at', 'users.username', 'reactions.type'])
        .execute();

      return postsWithReactions;
    } catch (error) {
      console.error('Erro ao listar postagens com reações:', error);
      throw new Error('Não foi possível listar as postagens com reações.');
    }
  }),

  // Adicionar reação a uma postagem
  addReaction: t.procedure
    .input(z.object({ postId: z.number(), userId: z.number(), type: z.string().min(1) })) // Tipo da reação deve ser uma string não vazia
    .mutation(async ({ input }) => {
      const { postId, userId, type } = input;

      try {
        // Verifica se a reação já existe para evitar duplicatas
        const existingReaction = await db
          .selectFrom('reactions')
          .where('post_id', '=', postId)
          .where('user_id', '=', userId)
          .execute();

        if (existingReaction.length > 0) {
          return { success: false, message: 'Reação já adicionada a esta postagem.' };
        }

        // Adiciona nova reação
        const newReaction = await db
          .insertInto('reactions')
          .values({
            id: uuidv4(),
            post_id: postId,
            user_id: userId,
            type: 'like',
            created_at: new Date()
          })
          .returning(['id', 'post_id', 'user_id', 'type'])
          .executeTakeFirstOrThrow();

        return { success: true, message: 'Reação adicionada com sucesso.', reaction: newReaction };
      } catch (error) {
        console.error('Erro ao adicionar reação:', error);
        throw new Error('Não foi possível adicionar a reação.');
      }
    }),
});